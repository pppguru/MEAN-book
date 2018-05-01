'use strict';

import rp from 'request-promise';
import moment from 'moment';
import parser from 'xml2json';
import Book from '../../api/book/book.model';
import { streamToS3 } from '../s3';
import { addObjectsToAlgolia } from '../algolia';
import { transformer, transformerForDiffAuthor, attachAuthorIds, attachGenreIds, saveLogs } from './helper';

const getOptions = (token, next) => {
    const options = {
        method: 'GET',
        uri: 'https://api.boknett.no/metadata/export/onix',
        headers: {
            Authorization: `Boknett ${token}`,
            Date: new Date().toUTCString()
        },
        resolveWithFullResponse: true,
        qs: {
            subscription: 'extended',
            // pagesize: 3
        }
    };
    _.extend(options.qs, next ? { next } : { after: moment('1100-01-01').format('YYYYMMDDHHmmss') });
    return options;
};

const getOptionsWithAfter = (token, next, after) => {
    const options = {
        method: 'GET',
        uri: 'https://api.boknett.no/metadata/export/onix',
        headers: {
            Authorization: `Boknett ${token}`,
            Date: new Date().toUTCString()
        },
        resolveWithFullResponse: true,
        qs: {
            subscription: 'extended',
            // pagesize: 3
        }
    };
    _.extend(options.qs, next ? { next } : { after });
    return options;
};

const allowedFormats = ['BC', 'BB'];

async function login() {
    const response = await rp({
        method: 'POST',
        uri: 'https://login.boknett.no/v1/tickets',
        resolveWithFullResponse: true,
        form: {
            username: '614145metadata',
            password: '*^X{83LcP2xgEaNu',
            // username: '614145metadatatest',
            // password: 'Q^Nk5^$=8JFfxt&m'
        }
    });
    return response.headers['boknett-tgt'];
}

async function getBooks({ logs }) { //eslint-disable-line no-unused-vars
    const token = await login();
    console.log('S T A R T ! ! ! Token :', token);

    let next;
    let oldNext;
    while (!next || next !== oldNext) {
        console.log('oldNext :', oldNext);
        oldNext = _.clone(next);
        const response = await rp(getOptions(token, next));
        next = response.headers.next;
        console.log('new Next :', next);
        console.log('------------------------------');
        const json = parser.toJson(response.body);
        if (logs) saveLogs(next, json);
        const products = _.filter(JSON.parse(json).ONIXMessage.Product, e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
        const books = _.map(products, transformer);

        /*

        const booksWODesc = await Book.find({ description: { $exists: false }, bokbasenId: { $in: _.map(books, 'bokbasenId') } });
        for (let book of booksWODesc) {
            const BBbook = _.find(books, { bokbasenId: book.bokbasenId });
            book.description = BBbook.description;
            book.save();
            console.log('added desc for book ', BBbook.title);
        }

        */
    }
    console.log('D O N E ! ! !');
}

async function getBook(isbn) { //eslint-disable-line no-unused-vars
    const token = await login();
    const response = await rp({
        method: 'GET',
        uri: `https://api.boknett.no/metadata/export/onix/${isbn}`,
        headers: {
            Authorization: `Boknett ${token}`,
            Date: new Date().toUTCString()
        },
        resolveWithFullResponse: true,
        qs: {
            subscription: 'extended'
        }
    });
    const json = parser.toJson(response.body);

    console.log('book json :', json);

    const products = _.filter(_.castArray(JSON.parse(json).ONIXMessage.Product), e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
    console.log('product : ', products[0]);
    const book = _.map(products, transformer);
    // saveLogs('aaa', json);//
    console.log('book :', book);
}

//******** Update the books for full image ********

async function updateBookWithFullImage(isbn) { //eslint-disable-line no-unused-vars
     const token = await login();

     const response = await rp({
          method: 'GET',
          uri: `https://api.boknett.no/metadata/export/onix/${isbn}`,
          headers: {
               Authorization: `Boknett ${token}`,
               Date: new Date().toUTCString()
          },
          resolveWithFullResponse: true,
          qs: {
               subscription: 'extended'
          }
     });
     const json = parser.toJson(response.body);
     const products = _.filter(_.castArray(JSON.parse(json).ONIXMessage.Product), e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
     const books = _.map(products, transformer);


     const booksToUpdate = await Book.find({ 'isbn.full' : { $in : _.map(books, 'isbn.full') }});

     for (let book of booksToUpdate) {
          const BBbook = _.find(books, { 'isbn' : { full : book.isbn.full} });

          if (BBbook && BBbook.image && BBbook.image.full) {
               book.image.full= await streamToS3(BBbook.image.full, 'books/' + book._id + '/full.png');
               await book.save();

               console.log('The book has been updated with full image :', book.isbn.full);
               fetched ++;
          }
     }
}

async function updateBooksWithFullImage() { //eslint-disable-line no-unused-vars
     const token = await login();

     const tmpBooks = await Book.find({ updatedAt : {$gte : new Date(2017, 5, 30), $lte : new Date(2017, 6, 1)}, image : {$exists : true} });
     console.log('=====Total books to be updated - S T A R T ! ! !: ', tmpBooks.length);

     let next;
     let oldNext;
     let fetched = 0;
     while (!next || next !== oldNext) {
          let books, response;
          try {
               oldNext = _.clone(next);
               response = await rp(getOptions(token, next));
               next = response.headers.next;
               const json = parser.toJson(response.body);
               const products = _.filter(JSON.parse(json).ONIXMessage.Product, e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
               books = _.map(products, transformer);
          }
          catch (e) {
               console.log('JSON Parse Error ======================= : \n', response.body);
               continue;
          }

          const booksToUpdate = await Book.find({ 'isbn.full' : { $in : _.map(books, 'isbn.full') }, updatedAt : {$gte : new Date(2017, 5, 30), $lte : new Date(2017, 6, 1)}, image : {$exists : true} });

          for (let book of booksToUpdate) {
               const BBbook = _.find(books, { 'isbn' : { full : book.isbn.full} });

               if (BBbook && BBbook.image && BBbook.image.full) {
                    book.image.full= await streamToS3(BBbook.image.full, 'books/' + book._id + '/full.png');
                    await book.save();

                    console.log('The book has been updated with full image :', book.isbn.full);
                    fetched ++;
               }
          }
     }

     console.log('D O N E ! ! !  Total books account', fetched);
}

//******** Add new books from daysago for the all books ********

async function addOrUpdateNewBooks(daysago) { //eslint-disable-line no-unused-vars
    const token = await login();
    const after = moment().subtract(daysago , 'days').format('YYYYMMDDHHmmss');

    console.log('===Add New Books - S T A R T ! ! ! ');

    let next;
    let oldNext;
    let totalCount = 0;
    let fetched = 0;
    while (!next || next !== oldNext) {
        console.log('/////////------------1000 records update STARTED------------------');
        var t0 = new Date().getTime();

        let books, response;
        try {
            console.log('oldNext :', oldNext);
            oldNext = _.clone(next);
            response = await rp(getOptionsWithAfter(token, next, after));
            next = response.headers.next;
            console.log('new Next :', next);
            console.log('------------------------------');
            const json = parser.toJson(response.body);
            const products = _.filter(JSON.parse(json).ONIXMessage.Product, e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
            books = _.map(products, transformer);
        }
        catch (e) {
            console.log('JSON Parse Error ======================= : \n', response.body);
            continue;
        }

        totalCount += books.length;
        for (let book of books) {
            try {
                var t3 = new Date().getTime();
                // console.log('------------Book Update Started------------------ : ', book.isbn.full);

                await attachAuthorIds(book);
                await attachGenreIds(book);

                let updatedBook = await Book.findOneAndUpdate(
                        { 'isbn.full' : book.isbn.full },
                        _.omit(book, 'image'),
                        {upsert : true, returnNewDocument : true, returnOriginal : false, new : true}
                    );

                if (!updatedBook){
                    console.log('++++++++Something wrong with Book =================: \n', _.omit(book, 'image'));
                    continue;
                }

                //----------------Add the images on the S3---------
                if (book.image) {
                    let smallImageURL, fullImageURL;
                    if (book.image.small) {
                        smallImageURL = await streamToS3(book.image.small, 'books/' + updatedBook._id + '/small.png');
                    }

                    if (book.image.full) {
                        fullImageURL = await streamToS3(book.image.full, 'books/' + updatedBook._id + '/full.png');
                    }

                    updatedBook.image.small = smallImageURL;
                    updatedBook.image.full = fullImageURL;

                    await updatedBook.save();
                }

                // ---------------- Update the Algolia ----------------
                let bookForAlgolia = await Book.findOne({ 'isbn.full' : book.isbn.full }, '_id isbn title publisher rating subtitle audience year format image genre author sales')
                                        .populate('author').lean();
                await addObjectsToAlgolia('books', bookForAlgolia);

                var t4 = new Date().getTime();
                // console.log('------------Book Update Ended------------------in : ' + (t4 - t3) / 1000 + ' seconds');
            }
            catch(e){
                console.log("addOrUpdateNewBooks function has the CRASH error: ", e);
            }
        }

        fetched += 1000;
        var t1 = new Date().getTime();
        console.log('/////////------------1000 records update FINISHED------------------' + fetched  + ' in : ' + (t1 - t0) / 1000 + ' seconds');
    }

    console.log('Total books account', totalCount);
    console.log('D O N E ! ! !');
}

//******** Fix the missing or incorrect information for the all books ********

async function repairExistingBooksWithLessAPICall() { //eslint-disable-line no-unused-vars
    const token = await login();
    console.log('S T A R T ! ! ! Token :', token);

    let fetched = 0;
    let next;
    let oldNext;
    while (!next || next !== oldNext) {

        console.log('/////////------------1000 records update STARTED------------------');
        var t0 = new Date().getTime();

        console.log('------------1000 API Fetch Started------------------');
        console.log('oldNext :', oldNext);
        oldNext = _.clone(next);
        const response = await rp(getOptions(token, next));
        next = response.headers.next;
        console.log('new Next :', next);
        const json = parser.toJson(response.body);
        const products = _.filter(JSON.parse(json).ONIXMessage.Product, e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
        const books = _.map(products, transformer);

        var t1 = new Date().getTime();
        console.log('------------1000 API Fetch Ended------------------ in : ' + (t1 - t0) / 1000 + ' seconds');

        for (let book of books) {
            try {
                var t2 = new Date().getTime();
                // console.log('------------Book Update Started------------------ : ', book.isbn.full);

                await attachAuthorIds(book);
                await attachGenreIds(book);

                await Book.findOneAndUpdate(
                        { 'isbn.full' : book.isbn.full },
                        {author : book.author, genre : book.genre},
                        // {upsert : true}
                    ).exec();

                var t3 = new Date().getTime();
                // console.log('------------Book Update Ended------------------in : ' + (t3 - t2) / 1000 + ' seconds');
            }
            catch(e){
                console.log("repairExistingBooksWithLessAPICall function has the CRASH error: ", e);
            }
        }

        fetched += 1000;
        var t4 = new Date().getTime();
        console.log('/////////------------1000 records update FINISHED------------------' + fetched  + ' in : ' + (t4 - t0) / 1000 + ' seconds');
    }
    console.log('D O N E ! ! !');
}

//******** Fix the missing or incorrect information for the existing book, such as genre, author, description, image ********
async function repairBook(isbn) { //eslint-disable-line no-unused-vars
    const token = await login();

    try {
        const response = await rp({
            method: 'GET',
            uri: `https://api.boknett.no/metadata/export/onix/${isbn}`,
            headers: {
                Authorization: `Boknett ${token}`,
                Date: new Date().toUTCString()
            },
            resolveWithFullResponse: true,
            qs: {
                subscription: 'extended'
            }
        });
        const json = parser.toJson(response.body);
        const products = _.filter(_.castArray(JSON.parse(json).ONIXMessage.Product), e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
        const book = _.map(products, transformer);

        // console.log("Book Info : ", book);

        //Update the author
        const booksWOAuthor = await Book.find({ 'isbn.full': { $in: _.map(book, 'isbn.full') } });
        for (let book of booksWOAuthor) {
            const updatedBook = _.map(products, transformer)[0];

            await attachAuthorIds(updatedBook);
            book.author = updatedBook.author;

            await attachGenreIds(updatedBook);
            book.genre = updatedBook.genre;

            await book.save();
            console.log('Updated author for book : ', book.title);
        }
    }
    catch(e){
        console.log("RepairBook function has the CRASH : ", e);
    }

    console.log("========End of RepairBook function==============");
}

// getBooks({ logs: true });
// getBook('9788200262220');//pappa

export {
     login,
     getBook,
     getBooks,
     repairBook,
     repairExistingBooksWithLessAPICall,
     addOrUpdateNewBooks,
     updateBooksWithFullImage,
     updateBookWithFullImage
};
