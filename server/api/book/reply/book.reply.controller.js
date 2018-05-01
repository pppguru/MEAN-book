/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/books/:id/reviews/:reviewId/reply              ->  create
 */

'use strict';

import BookReply from './book.reply.model';

export async function index(req, res) {
     const query = {book: req.params.id, reviewId: req.params.reviewId};
     const population = {path: 'user', select: 'firstName lastName imageUrl businessName'};
     const sort = {createdAt: -1};
     const bookReplies = await BookReply.find(query).populate(population).sort(sort).limit(+req.query.limit).skip(+req.query.skip).lean();
     res.status(200).json(bookReplies);
}

export async function create(req, res) {
     const newReply = await new BookReply(req.body).save();
     res.status(200).json(newReply);
}

export async function toggleLike(req, res) {
     const reply = await BookReply.findById(req.params.id, 'likes');
     reply.likes = _.xor(_.map(reply.likes, String), [req.user._id.toString()]);
     reply.noLikes = reply.likes.length;
     await reply.save();
     res.status(200).json(reply.likes);
}

export async function toggleFlag(req, res) {
     const reply = await BookReply.findById(req.params.id, 'flags');
     reply.flags = _.xor(_.map(reply.flags, String), [req.user._id.toString()]);
     reply.noFlags = reply.flags.length;
     await reply.save();
     res.status(200).json(reply.flags);
}
