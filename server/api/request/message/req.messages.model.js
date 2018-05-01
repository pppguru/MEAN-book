'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import Request from '../request.model';

const ReqMessageSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     request: {
          type: ObjectId,
          ref: 'Request'
     },
     type: {type: String, default: 'message'},
     message: String
}, {timestamps: true});

ReqMessageSchema.post('save', async (doc) => {
     const request = await Request.findById(doc.request);
     request.message = doc.message;
     if (!request.reactedAt && doc.user && doc.user.toString() === request.seller.toString()) { //seller first reply to message
          request.reactedAt = new Date();
     }
     request.save();
});

export default mongoose.model('ReqMessage', ReqMessageSchema);
