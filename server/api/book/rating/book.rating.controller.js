/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ratings              ->  index
 * POST    /api/ratings              ->  create
 * GET     /api/ratings/:id          ->  show
 */

'use strict';

import BookRating from './book.rating.model';
import mongoose from 'mongoose';
const {Types: {ObjectId}} = mongoose;

export async function index(req, res) {
     const query = {book: req.params.id};
     if (req.query.userId) {
          query.user = req.query.userId;
     }
     const rates = await BookRating.find(query).lean();
     res.status(200).json(rates);
}

export async function aggregate(req, res) {
     const ratings = await BookRating.aggregate([
          {$match: {book: new ObjectId(req.params.id)}},
          {$group: {_id: '$rate', size: {$sum: 1}}}
     ]).exec();
     const response = _.fill(new Array(5), 0);
     _.each(ratings, el => {
          response[el._id - 1] = el.size;
     });
     res.status(200).json(response.slice().reverse());
}

export async function show(req, res) {
     const rating = await BookRating.findById(req.params.id).lean();
     if (!rating) throw {code: 404, message: 'Rating not found'};
     res.status(200).json(rating);
}

export async function create(req, res) {
     req.body.gender = _.get(req, 'user.gender');
     let exist = await BookRating.findOne({user: req.user._id, book: req.body.book});
     if (exist) {
          exist.rate = req.body.rate;
          await exist.save();
     } else {
          exist = await new BookRating(req.body).save();
     }
     res.status(200).json(exist);
}

export async function update(req, res) {
     const exist = await BookRating.findById(req.params.rateId);
     if (!exist) throw {code: 404, message: 'Rate does not exist'};
     exist.rate = req.body.rate;
     exist.gender = _.get(req, 'user.gender');
     await exist.save();
     res.status(200).json(exist);
}
