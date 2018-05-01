/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/books/:id/reviews              ->  create
 */

'use strict';

import BookReview from './book.review.model';
import Rate from '../rating/book.rating.model';

export async function index(req, res) {
     const query = {book: req.params.id};
     const population = {path: 'user', select: 'firstName lastName businessName imageUrl businessName'};
     const sort = {noReplies: -1};
     if (req.query.userId) {
          query.user = req.query.userId;
     }
     const bookReviews = await BookReview.find(query).populate(population).sort(sort).limit(+req.query.limit).skip(+req.query.skip).lean();
     const rates = await Promise.all(_.map(_.map(bookReviews, el => ({book: el.book, user: el.user._id})), qr => Rate.findOne(qr)));
     _.each(rates, (rate, i) => {
          bookReviews[i].user.userRating = _.get(rate, 'rate', 0);
     });
     res.status(200).json(bookReviews);
}

export async function create(req, res) {
     const reviewedBookBefore = await BookReview.find({book: req.body.book, user: req.body.user}).count() > 0;
     if (reviewedBookBefore) throw {code: 400, message: 'Book already reviewed by user'};
     const newReview = await new BookReview(req.body).save();
     res.status(200).json(newReview);
}

export async function toggleLike(req, res) {
     const review = await BookReview.findById(req.params.reviewId, 'likes');
     review.likes = _.xor(_.map(review.likes, String), [req.user._id.toString()]);
     review.noLikes = review.likes.length;
     await review.save();
     res.status(200).json(review.likes);
}

export async function toggleFlag(req, res) {
     const review = await BookReview.findById(req.params.reviewId, 'flags');
     review.flags = _.xor(_.map(review.flags, String), [req.user._id.toString()]);
     review.noFlags = review.flags.length;
     await review.save();
     res.status(200).json(review.flags);
}
