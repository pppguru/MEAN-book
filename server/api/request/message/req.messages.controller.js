'use strict';

import ReqMessage from './req.messages.model';

export async function index(req, res) {
     const messages = await ReqMessage.find({request: req.params.id}).populate({path: 'user', select: 'firstName lastName businessName imageUrl'}).lean();
     res.status(200).json(messages);
}

export async function create(req, res) {
     req.body.user = req.user._id;
     req.body.request = req.params.id;
     Reflect.deleteProperty(req.body, '_id');
     const message = await new ReqMessage(req.body).save();
     res.status(200).json(message);
}
