'use strict';

import mongoose from 'mongoose';
const {Schema} = mongoose;

const PaymentAccountSchema = new Schema({
     id: String,
     chargesEnabled: {type: Boolean, default: false},
     transfersEnabled: {type: Boolean, default: false},
     balance: {
          available: {type: Number, default: 0},
          pending: {type: Number, default: 0}
     },
     verification: {fieldsNeeded: [String], dueBy: Date}
}, {_id: false, minimize: false});

export default PaymentAccountSchema;
