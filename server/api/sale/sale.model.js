'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import {emit} from './sales.service';
const {books: {conditions, formats}} = config;
import {syncUserNumeric, syncWithAzure} from './sales.service';

const SaleSchema = new Schema({
     book: {
          type: ObjectId,
          ref: 'Book'
     },
     seller: {
          type: ObjectId,
          ref: 'User'
     },
     status: {
          type: String,
          default: 'available'
     },
     format: {
          type: String,
          enum: formats,
          required: true
     },
     condition: {
          type: String, 
          enum: conditions,
          required: true
     },
     comment: String,
     delivery: String,
     price: {
          type: Number,
          required: true
     }
}, {timestamps: true});

SaleSchema.pre('save', emit);
SaleSchema.post('save', syncUserNumeric);
SaleSchema.post('save', syncWithAzure);

export default mongoose.model('Sale', SaleSchema);
