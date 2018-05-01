'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import {syncUserNumeric} from './bookshelf.service';

const BookshelfSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     public: {
          type: Boolean,
          default: true
     },
     read: {
          type: Boolean,
          default: false
     },
     active: {
          type: Boolean,
          default: true
     }
}, {timestamps: true});

BookshelfSchema.post('save', syncUserNumeric);

export default mongoose.model('Bookshelf', BookshelfSchema);
