'use strict';

import Conversation from './conversation.model';
import Message from '../message/messages.model';

export async function getMessages(req, res) {
     const messages = await Message.find({conversation: req.params.id}).populate('user', '-password -salt').lean();
     res.status(200).json(messages);
}

// export async function remove(req, res) {
//      const conversation = await Conversation.findById(req.params.id);
//      if (!conversation) throw {status: 404, message: 'Not found.'};
//      conversation.status = 'deleted';
//      await conversation.save();
//      res.status(204).end();
// }
