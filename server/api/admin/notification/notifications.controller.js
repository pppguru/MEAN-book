'use strict';

import Notification from '../../notification/notifications.model';

export async function index(req, res) {
     const notifications = await Notification.find()
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

