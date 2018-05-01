'use strict';

import moment from 'moment';
import emitter from '../../components/events';
import {initializeCharge} from '../../components/stripe/stripe.service';
import User from '../user/user.model';
import Request from './request.model'
import {calculateBookisServiceFee, calculateStripeProcessingFee} from '../../components/utils';
import {insertIntoTable, updateTableItem} from '../../components/azure';
const {events} = config;

export async function syncWithAzure() {
     const data = await Request.findById(this._id)
          .populate('seller')
          .populate('user')
          .lean();
     if (this.wasNew) {
          insertIntoTable({table: 'Requests', data});
     } else {
          updateTableItem({table: 'Requests', data});
     }
}

export async function initializeTransaction(request) {
     const defaultPayment = _.find(request.user.accounts.payment, 'isDefault');
     if (!defaultPayment) throw {code: 400, message: 'Payment method missing'};
     const seller = await User.findById(request.seller, 'accounts paymentAccount').lean();
     const defaultPayout = _.find(seller.accounts.payout, 'isDefault');
     if (!defaultPayout) throw {code: 400, message: 'Payout method missing'};
     if (!_.get(request, 'user.paymentCustomer.id') || !_.get(seller, 'paymentAccount.id')) throw {code: 400, message: 'Customer or managed id missing'};
     const service = await calculateBookisServiceFee({base: +request.price});
     const processing = +await calculateStripeProcessingFee({base: +request.price + +service.buyer});
     const amount = +request.price + +service.buyer + +processing;
     if (_.round(amount, 0) !== _.round(request.displayedPrice, 0)) {
          throw {code: 400, message: 'Amounts mismatch'};
     }
     const transaction = {
          paymentCustomerId: request.user.paymentCustomer.id,
          paymentMethodId: defaultPayment.id,
          service,
          processing,
          amount,
          currency: 'NOK',
          status: 'captured',
          destinationPaymentAccountId: seller.paymentAccount.id,
          payoutMethodId: defaultPayout.id
     };
     const charge = {
          customer: transaction.paymentCustomerId,
          source: transaction.paymentMethodId,
          amount: Math.round(transaction.amount * 100),
          application_fee: _.round((+_.sum(_.values(transaction.service)) + +transaction.processing) * 100, 0), //eslint-disable-line camelcase
          currency: transaction.currency,
          destination: transaction.destinationPaymentAccountId,
          description: `${request.user._id} paying ${seller._id} for sale ${request.sale}`,
          metadata: {
               saleId: request.sale
          }
     };
     transaction.chargeId = _.get(await initializeCharge(charge), 'id');
     return transaction;
}

export function handlePreSave(next) {
     this.wasNew = this.isNew;
     this.statusChanged = this.isModified('status');
     addExpirationDate(this);
     next();
}

export function handlePostInit() {
     this._original = this.toObject();
}

export function handlePostSave() {
     emit(this);
}

function addExpirationDate(doc) {
     if (!doc.isNew) return;
     doc.expire = moment(doc.createdAt).add(1, 'day');
}

export async function getRequestUsersIds({paramId}) {
     return await Request.findById(paramId, 'user seller _id').lean();
}

function emit(doc) {
     if (doc.wasNew) {
          emitter.emit(events.SALE_REQUESTED, doc);
     }
     if (doc.statusChanged) {
          if (doc.status === 'waiting') {
               emitter.emit(events.SALE_APPROVED, doc);
          }
          if (doc.status === 'delivered') {
               emitter.emit(events.SALE_DELIVERED, doc);
          }
          if (doc.status === 'expired') {
               emitter.emit(events.REQUEST_EXPIRED, doc);
          }
          if (doc.status === 'declined') {
               emitter.emit(events.SALE_DECLINED, doc);
          }
          if (doc.status === 'canceled') {
               emitter.emit(events.SALE_CANCELED, doc);
          }
     }
}
