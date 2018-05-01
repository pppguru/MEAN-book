'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;

const WaitinglistSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     notified: {
          type: Boolean,
          default: false
     }
}, {timestamps: true});

export default mongoose.model('Waitinglist', WaitinglistSchema);
