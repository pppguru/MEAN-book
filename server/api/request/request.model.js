'use strict';

import mongoose from 'mongoose';
import TransactionSchema from './transaction/transaction.model';
const {Schema, Schema: {ObjectId}} = mongoose;
import * as requestService from './request.service';

const RequestSchema = new Schema({
     sale: {
          type: ObjectId,
          ref: 'Sale'
     },
     user: {
          type: ObjectId,
          ref: 'User'
     },
     seller: {
          type: ObjectId,
          ref: 'User'
     },
     seen: {
          user: Date,
          seller: Date
     },
     expire: Date,
     reactedAt: Date,
     timestamps: {
          approved: Date,
          delivered: Date,
          canceled: Date,
          declined: Date
     },
     status: {type: String, default: 'pending'},
     delivery: String,
     message: String,
     reason: String,
     transaction: TransactionSchema,
     price: Number
}, {timestamps: true, minimize: false});

RequestSchema.pre('save', requestService.handlePreSave);
RequestSchema.post('init', requestService.handlePostInit);
RequestSchema.post('save', requestService.handlePostSave);
RequestSchema.post('save', requestService.syncWithAzure);

export default mongoose.model('Request', RequestSchema);
