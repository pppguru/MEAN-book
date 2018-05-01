'use strict';

import BookReview from '../../book/review/book.review.model';

export async function index(req, res) {
     res.status(200).json(await BookReview.find({noFlags: {$gte: 1}})
          .populate([
               {path: 'user', select: 'businessName firstName lastName imageUrl'},
               {path: 'book', select: 'imageUrl title'}
          ])
          .lean());
}

export async function destroy(req, res) {
     const review = await BookReview.findById(req.params.id);
     if (!review) throw {code: 404, message: 'Resource not found'};
     await review.remove();
     res.status(204).end();
}
