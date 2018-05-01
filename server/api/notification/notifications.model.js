'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;

const NotificationSchema = new Schema({
     source: {
          type: ObjectId,
          ref: 'User'
     },
     destination: {
          type: ObjectId,
          ref: 'User'
     },
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     review: {
          type: ObjectId,
          ref: 'BookReview'
     },
     meta: String,
     type: String,
     notified: {
          type: Date, 
          default: Date.now()
     }
}, {timestamps: true});

export default mongoose.model('Notification', NotificationSchema);
