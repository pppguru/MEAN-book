'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;

const StudySchema = new Schema({
     school: {
          type: ObjectId,
          ref: 'School'
     },
     name: String,
     semesters: Number
}, {timestamps: true});

export default mongoose.model('Study', StudySchema);
