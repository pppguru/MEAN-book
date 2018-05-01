'use strict';

import mongoose from 'mongoose';
const {Schema} = mongoose;

const GenreSchema = new Schema({
     no: String,
     en: String,
     description: String,
     imageUrl: String
}, {timestamps: true});

export default mongoose.model('Genre', GenreSchema);
