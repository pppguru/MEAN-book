'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import {updateBookRate} from './book.rating.service';

const BookRatingSchema = new Schema({
     user: {
          type: ObjectId,
          ref: 'User'
     },
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     gender: String,
     rate: Number
}, {timestamps: true});

BookRatingSchema.post('save', updateBookRate);

export default mongoose.model('BookRating', BookRatingSchema);
