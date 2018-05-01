'use strict';

import Book from '../book.model';
import BookRating from './book.rating.model';

export async function updateBookRate(doc) {
     const [[avgRate], [maleRate], [femaleRate], book] = await Promise.all([
          BookRating.aggregate([
               {$match: {book: doc.book}},
               {$group: {_id: null, avg: {$avg: '$rate'}, votes: {$sum: 1}}}
          ]),
          BookRating.aggregate([
               {$match: {book: doc.book, gender: 'male'}},
               {$group: {_id: null, avg: {$avg: '$rate'}, votes: {$sum: 1}}}
          ]),
          BookRating.aggregate([
               {$match: {book: doc.book, gender: 'female'}},
               {$group: {_id: null, avg: {$avg: '$rate'}, votes: {$sum: 1}}}
          ]),
          Book.findById(doc.book)
     ]);
     if (!avgRate) return;
     book.rating.avg = avgRate.avg;
     book.rating.votes = avgRate.votes;
     book.rating.male = _.pick(maleRate, ['votes', 'avg']);
     book.rating.female = _.pick(femaleRate, ['votes', 'avg']);
     book.save();
}
