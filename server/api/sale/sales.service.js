'use strict';

import Sale from './sale.model';
import User from '../user/user.model';
import emitter from '../../components/events';
import {insertIntoTable, updateTableItem} from '../../components/azure';
const {events} = config;

export function emit(next) {
     this._isNew = this.isNew;
     if (this.isNew) {
          emitter.emit(events.SALE_CREATED, this);
     }
     if (this.isModified('status') && _.includes(['deleted', 'deactivated'], this.status)) {
          emitter.emit(events.SALE_DELETED, this);
     }
     next();
}

export async function getSaleOwnerId({paramId}) {
     return _.get((await Sale.findById(paramId, 'seller').lean()), 'seller');
}

export async function syncUserNumeric(doc) {
     const user = await User.findById(doc.seller);
     user.numeric.sales = await Sale.find({seller: doc.seller, status : 'available'}).count();
     user.save();
}

export async function syncWithAzure() {
     const data = await Sale.findById(this._id)
          .populate('book')
          .populate('seller')
          .populate({path: 'book', populate: [
               {path: 'author', model: 'Author'},
               {path: 'genre', model: 'Genre'}
          ]}).lean();
     data.book.author = _.map(data.book.author, el => {
          if (el.corporateName) return el.corporateName;
          return `${el.firstName} ${el.lastName}`;
     })[0] || 'N/A';
     data.book.genre = _.map(data.book.genre, 'no')[0] || 'N/A';
     if (this._isNew) {
          insertIntoTable({table: 'Sales', data});
     } else {
          updateTableItem({table: 'Sales', data})
     }
}

