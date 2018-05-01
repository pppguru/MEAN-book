'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import emitter from '../../components/events';
const {events} = config;

const ConversationSchema = new Schema({
     participants: [{
          type: ObjectId,
          ref: 'User'
     }],
     total: Number,
     message: String,
     status: {
          type: String,
          default: 'active'
     }
}, {timestamps: true});

ConversationSchema.pre('save', function(next) {
     this._isNew = this.isNew;
     next();
});

ConversationSchema.post('save', async function(doc) {
     this._isNew && emitter.emit(events.CONVERSATION_STARTED, doc);
});

export default mongoose.model('Conversation', ConversationSchema);
