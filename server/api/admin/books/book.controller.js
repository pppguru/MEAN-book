'use strict';

import Book from '../../book/book.model';
import User from '../../user/user.model';
import {booksAggregation} from '../../../components/aggregations/_books';
import {transformMonthlyAggregation} from '../../../components/aggregations/utils';
import {createBook, createSale, lowerFields} from '../../book/book.controller';
import path from 'path';
import fs from 'fs';
import {xlsToJson} from '../../../components/xls-json';

export async function index(req, res) {
     res.status(200).json(await Book.find().populate('author').limit(10).lean());
}

export async function bulk(req, res) {
     const excel = path.join(__dirname, '../../../..', req.file.path);
     const books = _.map(await xlsToJson(excel), lowerFields);
     const seller = await User.findById(req.body.userId);
     const sales = [];
     if (_.size(books) && books[0].isbn) {
          for (const {price, condition, isbn} of books) {
               if (!price || !condition || !isbn) throw {code: 400, message: 'Bad sale request'};
               const book = await Book.findOne({$or: [{'isbn.full': isbn}, {'isbn.short': isbn}]});
               if (!book) throw {code: 400, message: `Book with ${isbn} not found!`};
               const sale = await createSale({seller, book, price, condition});
               sales.push(sale);
          }
     } else if (_.size(books) && !books[0].isbn) {
          for (let book of books) {
               const newBook = await createBook({book});
               if (!book.price || !book.condition) throw {code: 400, message: 'Bad sale request'};
               const sale = await createSale({seller, book: newBook, price: book.price, condition: book.condition});
               sales.push(sale);
          }
     }
     fs.unlink(excel);
     res.status(200).json(sales);//TODO exposed password+salt
}

export async function toggleCourse(req, res) {
     const book = await Book.findById(req.params.id);
     if (!book) throw {code: 404, message: 'Resource not found'};
     book.courses = book.courses || [];
     const i = _.indexOf(_.map(book.courses, String), req.params.courseId.toString());
     if (i === -1) {
          book.courses.push(req.params.courseId);
     } else {
          book.courses.splice(i, 1);
     }
     await book.save();
     res.status(200).json(book);
}

export async function getCourseBooks(req, res) {
     const books = await Book.find({courses: {$in: [req.params.courseId]}});
     res.status(200).json(books);
}

export async function aggregation(req, res) {
     const year = _.get(req, 'query.year');
     const aggregationData = await Book.aggregate(booksAggregation(year));
     res.status(200).json(transformMonthlyAggregation(aggregationData));
}
