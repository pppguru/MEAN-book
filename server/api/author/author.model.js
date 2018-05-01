'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;

const AuthorSchema = new Schema({
     firstName: String,
     lastName: String,
     corporateName: String,
    //  bokbasenId: {type: String, index: {unique: true}},
     bokbasenId: {type: String, index: {sparse : true}},  //There could be some records without this field as null
     year: String,
     followers: [{type: ObjectId, ref: 'User'}],
     numeric: {
          followers: {type: Number, default: 0}
     },
     country: String
});

export default mongoose.model('Author', AuthorSchema);
