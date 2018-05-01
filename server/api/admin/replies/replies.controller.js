'use strict';

import BookReply from '../../book/reply/book.reply.model';

export async function index(req, res) {
     res.status(200).json(await BookReply.find({noFlags: {$gte: 1}})
          .populate([
               {path: 'user', select: 'businessName firstName lastName imageUrl'},
               {path: 'book', select: 'imageUrl title'}
          ])
          .lean());
}

export async function destroy(req, res) {
     const reply = await BookReply.findById(req.params.id);
     if (!reply) throw {code: 404, message: 'Resource not found'};
     await reply.remove();
     res.status(204).end();
}
