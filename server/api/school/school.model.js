'use strict';

import mongoose from 'mongoose';
const {Schema} = mongoose;

const SchoolSchema = new Schema({
     name: String
}, {timestamps: true});

export default mongoose.model('School', SchoolSchema);
