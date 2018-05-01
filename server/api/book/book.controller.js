/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/books              ->  index
 * POST    /api/books              ->  create
 * GET     /api/books/:id          ->  show
 * PUT     /api/books/:id          ->  upsert
 * PATCH   /api/books/:id          ->  patch
 * DELETE  /api/books/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Book from './book.model';
import Sale from '../sale/sale.model';
import Genre from '../genre/genre.model';
import Author from '../author/author.model';
import Course from '../school/study/course/course.model';
import path from 'path';
import {xlsToJson} from '../../components/xls-json';
import fs from 'fs';
import Excel from 'exceljs';

export async function index(req, res) {
     const books = await Book.find({'image.full': {$ne: null}}).limit(20).populate('author')
          .populate({path: 'sales', match: {status: 'available'}, options: {sort: {price: 1}}, populate: {path: 'seller', model: 'User', select: 'firstName lastName businessName imageUrl address'}}).lean();
     res.status(200).json(books);
}

export async function getSuggested(req, res) {
     _.extend(req.query, {_id: {$ne: req.params.id}, 'image.full': {$ne: null}});
     const books = await Book.find(req.query).limit(3).sort({'rating.avg': -1}).populate('author')
          .populate({path: 'sales', match: {status: 'available'}, options: {sort: {price: 1}}}).lean();
     res.status(200).json(books);
}

export async function getISBN(req, res) {
     const book = await Book.findOne(req.query, 'isbn').lean();
     res.status(200).json(book);
}

export async function getRecommended(req, res) {
     const bookPopulation = {
          path: 'sales',
          match: {status: 'available'},
          options: {sort: {price: 1}},
          populate: {path: 'seller', model: 'User', select: 'firstName lastName businessName imageUrl'}
     };
     const recommended = await Book.find({'sales.0': {$exists: true}, 'image.full': {$exists: true}}).populate('author').populate(bookPopulation).limit(18).lean();
     const newThisWeek = await Book.find({'isbn.full': '9788241913297'}).populate('author').populate(bookPopulation).lean();
     res.status(200).json({recommended, newThisWeek});
}

export async function getKidsRecommended(req, res) {
     const kidsRecommended = await Book.find({audience: {$ne: 'Voksen', $exists: true}, 'image.full': {$ne: null}}).populate('author').populate({
          path: 'sales',
          match: {status: 'available'},
          options: {sort: {price: 1}},
          populate: {path: 'seller', model: 'User', select: 'firstName lastName businessName imageUrl'}
     }).limit(8).lean();
     res.status(200).json(kidsRecommended);
}

export async function getKidsPopular(req, res) {
     const kidsPopular = await Book.find({audience: {$ne: 'Voksen', $exists: true}, 'image.full': {$ne: null}}).populate('author').populate({
          path: 'sales',
          match: {status: 'available'},
          options: {sort: {price: 1}},
          populate: {path: 'seller', model: 'User', select: 'firstName lastName businessName imageUrl'}
     }).sort({'rating.avg': 1}).limit(8).lean();
     res.status(200).json(kidsPopular);
}

export async function getStudentsBooks(req, res) {
     let query = _.pick(req.query, ['study', 'semester']);
     const courses = await Course.find(query);
     const books = await Book.find({courses: {$in: _.map(courses, '_id')}}).populate('author').populate('genre').lean();
     res.status(200).json(books);
}

export async function autocomplete(req, res) {
     const book = await Book.findOne({$or: [
          {'isbn.full': req.query.isbn},
          {'isbn.short': req.query.isbn}
     ]}).populate('author').lean();
     res.status(200).json(book);
}

export async function show(req, res) {
     const book = await Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .populate({path: 'sales', match: {status: 'available'}, options: {sort: {price: 1}}, populate: {path: 'seller', select: '-password -salt -notifications -__v', model: 'User'}}).lean();
     if (!book) throw {code: 404, message: 'Book not found'};
     res.status(200).json(book);
}

// export async function create(req, res) {
//      req.body.user = req.user._id;
//      const book = await new Book(req.body).save();
//      res.status(200).json(book);
// }

export async function bulk(req, res) {
     const excel = path.join(__dirname, '../../..', req.file.path);
     const valid = req.body.valid;
     const excelBooks = _.map(await xlsToJson(excel), lowerFields);
     const groupedExcelBooks = _.groupBy(excelBooks, 'isbn');
     const seller = req.user;
     const foundBooks = _.uniqBy(await Book.find({'isbn.full': {$in: _.keys(groupedExcelBooks)}}).populate('genre').populate('author'), 'isbn.full');
     let createdSales = 0;
     let progress = 0;
     for (const book of foundBooks) {
          const sales = groupedExcelBooks[book.isbn.full];
          const transformed = _.map(_.filter(sales, e => _.includes(config.books.conditions, e.condition.toLowerCase())), s => ({
               seller: seller._id,
               status: 'available',
               updatedAt: new Date(),
               createdAt: new Date(),
               __v: 0,
               book: book._id,
               price: s.price,
               condition: s.condition,
               format: book.format,
               delivery: seller.delivery.shipping.enabled && seller.delivery.meetup.enabled ? 'both' : seller.delivery.shipping.enabled ? 'shipping' : 'meetup'
          }));
          if (transformed.length) {
               const created = await Sale.collection.insert(transformed);//avoid hooks triggers
               book.sales.push(..._.map(created.ops, '_id'));
               await book.save();//update book sale + update availability on algolia

               createdSales += sales.length;
               let currentProgress = _.round(createdSales / valid * 100, 0);
               progress !== currentProgress && SOCKET_IO.emit('BULK_SALE_UPDATE', {progress: currentProgress});
               progress = _.clone(currentProgress);
          }
     }
     fs.unlink(excel);

     res.status(200).end();
}

export async function validate(req, res) {
     const excel = path.join(__dirname, '../../..', req.file.path);
     const excelBooks = _.map(await xlsToJson(excel), lowerFields);
     const groupedExcelBooks = _.groupBy(excelBooks, 'isbn');
     const foundBooks = await Book.find({'isbn.full': {$in: _.keys(groupedExcelBooks)}}).distinct('isbn.full').lean();
     let invalidExportLink;

     const invalids = _.filter(excelBooks, e => !_.includes(foundBooks, e.isbn) || !_.includes(config.books.conditions, e.condition.toLowerCase()));
     if (invalids.length) {
          const workbook = new Excel.Workbook();
          const sheet = workbook.addWorksheet('Invalids');
          sheet.columns = [
               {header: 'ISBN', key: 'isbn'},
               {header: 'Condition', key: 'condition'},
               {header: 'Price', key: 'price'}
          ];
          sheet.addRows(invalids);
          invalidExportLink = `/uploads/Invalids-(${req.file.originalname}).xlsx`;
          workbook.xlsx.writeFile(`.${invalidExportLink}`);
     }

     fs.unlink(excel);
     res.status(200).json({total: excelBooks.length, valid: excelBooks.length - invalids.length, invalid: invalids.length, validated: true, invalidExportLink});
}

export async function createBook({book}) {
     if (!book.genre || !book.author || !book.title || !book.format) throw {code: 400, message: 'Bad book request'};
     let genre = await Genre.findOne({$or: [{no: book.genre}, {en: book.genre}]});
     book.genre = genre ? genre : await new Genre({no: book.genre, en: book.genre}).save();
     const [firstName, lastName] = book.author.split(' ');
     let author = await Author.findOne({firstName: new RegExp(firstName, 'i'), lastName: new RegExp(lastName, 'i')});
     book.author = author ? author : await new Author({firstName, lastName}).save();
     if (!book.title || !book.price || !book.condition) throw {code: 400, message: 'Bad sale request'};
     let newBook = await Book.findOne({title: new RegExp(book.title, 'i'), author: {$in: [author._id]}, year: book.year, format: book.format});
     if (!newBook) newBook = await new Book(book).save();
     return newBook;
}

// export async function upsert(req, res) {
//      const book = await Book.findById(req.params.id);
//      if (book.status === 'requested') throw {status: 403, message: 'Cannot update requested book.'};
//      _.extend(book, req.body);
//      await book.save();
//      res.status(200).json(book);
// }

//TODO: fix
// export async function patch(req, res) {
//      if (req.body._id) {
//           Reflect.deleteProperty(req.body, '_id');
//      }
//      const book = await Book.findById(req.params.id);
//      if (!book) throw {code: 404, message: 'Book not found'};
//      await patchUpdates(book, req.body);
//      res.status(200).json(book);
// }

// export async function destroy(req, res) {
//      let book = await Book.findById(req.params.id);
//      if (!book) throw {code: 404, message: 'Book not found'};
//      book.active = false;
//      await book.save();
//      res.status(204).end();
// }

async function patchUpdates(entity, body) {
     try {
          jsonpatch.apply(entity, body, true); //eslint-disable-line prefer-reflect
     } catch (err) {
          return Promise.reject(err);
     }
     return entity.save();
}

export function lowerFields(book) {
     return _.forOwn(book, (v, k) => {
          book[k.toLowerCase()] = v;
          delete book[k]; //eslint-disable-line prefer-reflect
     });
}
