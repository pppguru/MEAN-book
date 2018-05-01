'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import emitter from '../../components/events';
const {events} = config;

const MessageSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     conversation: {
          type: ObjectId,
          ref: 'Conversation'
     },
     message: String
}, {timestamps: true});

MessageSchema.post('save', async doc => emitter.emit(events.MESSAGE_SENT, doc));

export default mongoose.model('Message', MessageSchema);
