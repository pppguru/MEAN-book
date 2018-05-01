'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import {syncUserNumeric} from './wishlist.service';

const WishlistSchema = new Schema({
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
     active: {
          type: Boolean,
          default: true
     }
}, {timestamps: true});

WishlistSchema.post('save', syncUserNumeric);

export default mongoose.model('Wishlist', WishlistSchema);
