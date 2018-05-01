'use strict';

import mongoose from 'mongoose';
const {Schema} = mongoose;

const PaymentMethodSchema = new Schema({
     provider: String,
     id: String,
     type: String,
     brand: String,
     name: String,
     account_holder_name: String, //eslint-disable-line camelcase
     account_holder_type: String, //eslint-disable-line camelcase
     bank: String,
     country: String,
     currency: String,
     routing_number: String, //eslint-disable-line camelcase
     address_line: String, //eslint-disable-line camelcase
     address_state: String, //eslint-disable-line camelcase
     address_zip: String, //eslint-disable-line camelcase
     address_city: String, //eslint-disable-line camelcase
     exp_month: Number, //eslint-disable-line camelcase
     exp_year: Number, //eslint-disable-line camelcase
     address_country: String, //eslint-disable-line
     endingWith: String,
     fingerprint: String,
     isDefault: Boolean
}, {_id: false});

export default PaymentMethodSchema;
