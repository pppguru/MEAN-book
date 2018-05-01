'use strict';

import mongoose from 'mongoose';
const {Schema} = mongoose;

const ConstantsSchema = new Schema({
     fees: {
          seller: {type: Number, default: 9.5},
          buyer: {type: Number, default: 9.5}
     },
     rootPassword: String
}, {timestamps: true});

export default mongoose.model('Constants', ConstantsSchema);
