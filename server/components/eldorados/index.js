'use strict';

import rp from 'request-promise';
import moment from 'moment';
import parser from 'xml2json';
import User from '../../api/user/user.model';
import Sale from '../../api/sale/sale.model';
import Book from '../../api/book/book.model';

async function fetchInventoryAndPrice(isbn) {

    console.log("===Start fetch information from Eldorados for ISBN : ", isbn);

    const response = await rp({
        method: 'POST',
        uri: `http://services.jm-data.no/multidecII.asmx/HentBeholdningOgPris`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        resolveWithFullResponse: true,
        form: {
            psun: 'bookisftp',
            pspw: 'Bookis1337!',
            psISBN : isbn
        }
    });

    const json = parser.toJson(response.body);
    console.log('fetch information json :', json);

    // const products = _.filter(_.castArray(JSON.parse(json).ONIXMessage.Product), e => _.includes(allowedFormats, _.get(e, 'DescriptiveDetail.ProductForm')));
    // const book = _.map(products, transformer);
    // // saveLogs('aaa', json);//
    // console.log('book :', book);
}

async function fetchAllInventoryAndPrice() {

    console.log("===Start fetch all information from Eldorados ");

    const response = await rp({
        method: 'POST',
        uri: `http://services.jm-data.no/multidecII.asmx/HentBeholdningOgPris`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        resolveWithFullResponse: true,
        form: {
            psun: 'bookisftp',
            pspw: 'Bookis1337!',
            psISBN : '*'
        }
    });

    const json = parser.toJson(response.body);
    const itemString = _.get(JSON.parse(json).string, '$t');
    const items = _.split(itemString, '\n');
    console.log('Count of items : ', items.length);

    const saleISBNs = [];
    _.forEach(items, function(value){
        let elements = _.split(value, ';');
        let elementInfo = {
            'isbn' : elements[0],
            'quantity' : elements[1],
            'price' : elements[2]
        }

        saleISBNs.push(elementInfo);
    });

    const booksWithSale = await Book.find({ 'isbn.full': { $in: _.map(saleISBNs, 'isbn') } });

    console.log('books count for sale from eldorados : ', booksWithSale.length);

    const sellerEldorado = _.head(await User.find({ 'role': 'merchant', businessName : 'Eldorado'}));
    const sellerID = sellerEldorado._id;

    console.log('seller id : ', sellerID);

    for (let book of booksWithSale) {
        try {

            const bookID = book._id;
            const bISBN = _.find(saleISBNs, { isbn: book.isbn.full });

            const price = _.replace(bISBN.price, ',', '.');
            const condition = 'new';
            const format = book.format;
            const delivery = 'shipping';
            let status = '';
            if (parseInt(bISBN.quantity) > 0)
                status = 'available';
            else
                status = 'unavailable';

            //Update or Insert the Sale
             let updateSale = await Sale.findOneAndUpdate(
                    { 'seller': sellerID, 'book' : bookID },
                    {status : status, delivery : delivery, format : format, condition : condition, price : price, seller: sellerID, book : bookID},
                    {upsert : true, returnNewDocument : true, returnOriginal : false, new : true}
                );

             console.log('sale info is updated : ', updateSale._id);

            //Update the sales of Book model
             book.sales = _.compact(book.sales);
             book.sales.push(updateSale._id);
             book.sales = _.uniq(book.sales);
             await book.save();

             console.log('Book sale field is updated : ', book.isbn.full);
        }
        catch(e) {
            console.log('=========== ERROR =============', e);
        }
    }
}

export {
    fetchInventoryAndPrice,
    fetchAllInventoryAndPrice
};
