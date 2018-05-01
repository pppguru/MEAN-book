'use strict';

import mongoose from 'mongoose';
const {Schema, Schema: {ObjectId}} = mongoose;
import {updateAlgoliaObject} from '../../components/algolia';

const BookSchema = new Schema({
     isbn: {
          full: String,
          short: String
     },
     bokbasenId: {type: String, index: {unique : true, sparse : true}},
     language: [String],
     genre: [{type: ObjectId, ref: 'Genre'}],
     subject: [String],
     form: [String],
     place: [String],
     litterary: [String],
     title: String,
     subtitle: String,
     audience: String,
     author: [{type: ObjectId, ref: 'Author'}],
     description: String,
     active: {type: Boolean, default: true},
     supply: {
          status: String,
          availability: String,
          supplier: String
     },
     price: {
          amount: {type: Number},
          type: {type: String}
     },
     tax: {
          amount: {type: Number},
          type: {type: String}
     },
     image: {
          small: String,
          full: String
     },
     publisher: String,
     currency: String,
     measure: {
          weight: Number,
          height: Number,
          width: Number,
          thickness: Number
     },
     format: String,
     condition: {type: String, default: 'new'},
     comment: String,
     year: Number,
     rating: {
          avg: {type: Number, default: 0},
          votes: {type: Number, default: 0},
          male: {
               avg: {type: Number, default: 0},
               votes: {type: Number, default: 0}
          },
          female: {
               avg: {type: Number, default: 0},
               votes: {type: Number, default: 0}
          }
     },
     reviews: {type: Number, default: 0},
     user: {
          type: ObjectId,
          ref: 'User'
     },
     sales: [{
          type: ObjectId,
          ref: 'Sale'
     }],
     courses: [{
          type: ObjectId,
          ref: 'Course'
     }]
}, {timestamps: true});

BookSchema.index({'isbn.full': 1});

BookSchema.pre('save', function(next) {
     if (!this.isNew) {
          this._rateModified = this.isModified('rating.avg') || this.isModified('rating.male.avg') || this.isModified('rating.female.avg');
          this._salesModified = this.isModified('sales');
     }
     next();
});

BookSchema.post('save', function() {
     if (this._rateModified) {
          updateAlgoliaObject('books', this._id.toString(), {
               rate: _.round(this.rating.avg, 1),
               femaleRate: _.round(this.rating.female.avg, 1),
               maleRate: _.round(this.rating.male.avg, 1)
          });
     }
     if (this._salesModified) {
          updateAlgoliaObject('books', this._id.toString(), {available: this.sales.length});
     }
});

export default mongoose.model('Book', BookSchema);
