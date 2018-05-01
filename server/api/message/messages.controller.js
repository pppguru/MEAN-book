'use strict';

import Message from './messages.model';
import Conversation from '../conversation/conversation.model';

export async function create(req, res) {
     console.log('Req.body :', req.body);
     if (_.isEmpty(_.get(req, 'body.receivers')) && !_.get(req, 'body.conversation')) throw {code: 400, message: 'Missing mandatory fields'};
     if (!req.body.conversation) {
          //has receivers
          if (req.body.receivers.indexOf(req.user._id) !== -1) throw {code: 400, message: 'Bad message request'};
          if (req.body.receivers.length === 1) {
               const participants = [req.user._id, req.body.receivers[0]];
               console.log('Participants :', participants);
               req.body.conversation = await Conversation.findOne({
                    $and: [
                         {participants: {$all: participants}},
                         {'participants.2': {$exists: false}}
                    ]
               });
               req.body.conversation = req.body.conversation || await new Conversation({participants, total: participants.length, message: req.body.message}).save();
          } else {
               //TODO handle group chats
          }
     }
     const message = await new Message({
          user: req.user._id,
          message: req.body.message,
          conversation: req.body.conversation
     }).save();
     res.status(200).json(message);
}
