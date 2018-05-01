'use strict';

import mongoose from 'mongoose';
const {Schema} = mongoose;
const {transactions: {statuses}} = config;

const TransactionSchema = new Schema({
     amount: {type: Number, required: true},
     currency: {type: String, required: true},
     paymentCustomerId: {type: String, required: true},
     destinationPaymentAccountId: {type: String, required: true},
     transferredAt: {type: Date, required: false},
     status: {type: String, enum: statuses, default: statuses[0], required: true},
     paymentMethodId: {type: String, required: false},
     processing: {type: Number, required: true},
     service: {
          seller: {type: Number, required: true},
          buyer: {type: Number, required: true}
     },
     chargeId: {type: String, required: false},
     refundId: {type: String, required: false},
     transferId: {type: String, required: false},
     balanceTransactionId: {type: String, required: false}
}, {timestamps: true});

export default TransactionSchema;
