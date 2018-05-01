'use strict';

import Notification from './notifications.model';

export async function index(req, res) {
     const notifications = await Notification.find({
          $or: [
               {destination: req.query.userId, type: {$in: ['following', 'conversation']}},
               {source: req.query.userId, type: {$in: ['review', 'reply']}},
               {$or: [{destination: req.query.userId}, {source: req.query.userId}], type: {$in: ['bought']}}
          ]
     })
          .populate('source', 'firstName lastName businessName role imageUrl')
          .populate('destination', 'firstName lastName businessName role imageUrl')
          .populate('review')
          .populate({
               path: 'book',
               populate: [
                    {path: 'author', model: 'Author'},
                    {path: 'genre', model: 'Genre'}
               ]
          })
          .sort({createdAt: -1})
          .lean();
     res.status(200).json(notifications);
}

