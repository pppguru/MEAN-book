'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;

const CourseSchema = new Schema({
     study: {
          type: ObjectId,
          ref: 'Study'
     },
     school: {
          type: ObjectId,
          ref: 'School'
     },
     name: String,
     semester: Number
}, {timestamps: true});

export default mongoose.model('Course', CourseSchema);
