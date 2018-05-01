'use strict';

import User from './user.model';
import Rate from '../book/rating/book.rating.model';
import Sale from '../sale/sale.model';
import Request from '../request/request.model';
import Conversation from '../conversation/conversation.model';
import WishList from '../wishlist/wishlist.model';
import Waitinglist from '../waitinglist/waitinglist.model';
import Bookshelf from '../bookshelf/bookshelf.model';
import jwt from 'jsonwebtoken';
import * as userService from './user.service';
import moment from 'moment';
import mongoose from 'mongoose';
import {transformMonthlyAggregation} from '../../components/aggregations/utils';
import {getIp} from '../../components/utils';
import emitter from '../../components/events';
const {events} = config;
const {Types: {ObjectId}} = mongoose;

export async function getUserConversations(req, res) {
     const conversations = await Conversation.find({participants: req.user._id}).populate('participants', '-password -salt').lean();
     res.status(200).json(conversations);
}

export async function getUserRequests(req, res) {
     const query = {$or: [{seller: req.user._id}, {user: req.user._id}], status: {$in: ['pending', 'waiting', 'delivered']}};
     const requests = await Request.find(query, '-transaction')
          .populate({path: 'sale', populate: {path: 'book', model: 'Book', populate: {path: 'author', model: 'Author'}}})
          .populate('user', 'firstName lastName businessName imageUrl')
          .populate('seller', 'firstName lastName businessName imageUrl')
          .sort('-updatedAt').lean();
     res.status(200).json(requests);
}

export async function getUserIncomingRequests(req, res) {
     const query = {seller: req.user._id, status: {$in: ['pending', 'waiting', 'delivered']}};
     if (req.query.saleId) {
          query.sale = req.query.saleId;
     }
     const requests = await Request.find(query, '-transaction')
          .populate({path: 'sale', populate: {path: 'book', model: 'Book', populate: {path: 'author', model: 'Author'}}})
          .populate({path: 'user', select: 'firstName lastName businessName'}).lean();
     res.status(200).json(requests);
}

export async function getUserIncomingRequestsAggregation(req, res) {
     const result = await makeRequestAggregation(req, {seller: req.user._id});
     res.status(200).json(result);
}

export async function getUserSentRequestsAggregation(req, res) {
     const result = await makeRequestAggregation(req, {user: req.user._id});
     res.status(200).json(result);
}

export async function getUserSentRequests(req, res) {
     const query = {user: req.user._id};
     if (req.query.saleId) {
          query.sale = req.query.saleId;
          query.status = {$in: ['pending', 'declined', 'waiting']};
     }
     const requests = await Request.find(query, '-transaction')
          .populate({path: 'sale', populate: {path: 'book', model: 'Book', populate: {path: 'author', model: 'Author'}}})
          .populate({path: 'user', select: 'firstName lastName businessName'})
          .populate({path: 'seller', select: 'firstName lastName businessName'}).lean();
     res.status(200).json(requests);
}

export async function getUserWishList(req, res) {
     const query = {user: req.params.id, active: true};
     if (req.query.bookId) {
          query.book = req.query.bookId;
          delete query.active;
     }
     const wishList = await WishList.find(query)
          .populate({path: 'book', populate: {path: 'author', model: 'Author'}}).lean();
     res.status(200).json(wishList);
}

export async function getUserWaitinglist(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     const query = {user: req.params.id, notified: false};
     if (req.query.bookId) {
          query.book = req.query.bookId;
     }
     const waitinglist = await Waitinglist.find(query)
          .populate({path: 'book', populate: {path: 'author', model: 'Author'}}).lean();
     res.status(200).json(waitinglist);
}

export async function getUserPublicWishList(req, res) {
     const query = {user: req.params.id, active: true, public: true};
     const wishList = await WishList.find(query)
          .populate({path: 'book', populate: {path: 'author', model: 'Author'}}).lean();
     res.status(200).json(wishList);
}

export async function getUserBookshelf(req, res) {
     const query = {user: req.params.id, active: true};
     if (req.query.bookId) {
          query.book = req.query.bookId;
          query.read = true;
          delete query.active;
     }
     const bookshelf = await Bookshelf.find(query)
          .populate({path: 'book', populate: {path: 'author', model: 'Author'}}).lean();
     const rates = await Promise.all(_.map(_.map(bookshelf, el => ({book: el.book._id, user: req.user._id})), qr => Rate.findOne(qr)));
     _.each(rates, (rate, i) => {
          bookshelf[i].book.userRating = _.get(rate, 'rate', 0);
     });
     res.status(200).json(bookshelf);
}

export async function getUserPublicBookshelf(req, res) {
     const query = {user: req.params.id, active: true, public: true};
     const bookshelf = await Bookshelf.find(query)
          .populate({path: 'book', populate: {path: 'author', model: 'Author'}}).lean();
     res.status(200).json(bookshelf);
}

export async function getUserBookshelfAggregation(req, res) {
     const year = req.query.year;
     const query = {
          user: req.user._id,
          createdAt: {$gte: new Date(moment(new Date(year)).startOf('year')), $lte: new Date(moment(new Date(year)).endOf('year'))}
     };
     const data = await Bookshelf.aggregate([
          {$match: query},
          {$group: {_id: {date: {$dateToString: {format: '%m', date: '$createdAt'}}}, count: {$sum: 1}}},
          {$project: {month: '$_id.date', _id: 0, count: 1}}
     ]);
     const result = _.reduce(data, (agg, el) => {
          const month = +el.month - 1;
          agg[month] += el.count;
          return agg;
     }, _.fill(new Array(12), 0));
     res.status(200).json(result);
}

export async function getUserSales(req, res) {
     const user = req.query.userId;
     const sales = await Sale.find({seller: req.params.id, status: {$ne: 'deleted'}})
          .populate({path: 'book', populate: {path: 'author', select: 'firstName lastName corporateName', model: 'Author'}})
          .populate({path: 'seller', select: '-salt -password -phone -notifications'}).limit(100).lean();
     if (user) {
          const rates = await Promise.all(_.map(_.map(sales, el => ({book: el.book._id, user})), qr => Rate.findOne(qr)));
          _.each(rates, (rate, i) => {
               sales[i].book.userRating = _.get(rate, 'rate', 0);
          });
     }
     res.status(200).json(sales);
}

export async function create(req, res) {
     req.body.provider = 'local';
     if (req.body.role === 'admin') throw {code: 403, message: 'admin cannot be created'};
     const user = await new User(req.body).save();
     const token = jwt.sign({_id: user._id}, process.env.SESSION_SECRET, { expiresIn: 60 * 60 * 5});
     res.status(201).json({token});
}

export async function createAccount(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     const requiredCardFields = ['number', 'exp_month', 'exp_year', 'cvc'];
     const requiredBankFields = ['account_number'];
     const allowedUsages = ['payment', 'payout'];
     const allowedTypes = ['Credit card', 'Debit card', 'Bank account', 'PayPal'];

     if (!req.body.usage || !_.includes(allowedUsages, req.body.usage)) {
          throw {code: 400, message: 'Missing or invalid usage field'};
     }

     if (!req.body.type || !_.includes(allowedTypes, req.body.type)) {
          throw {code: 400, message: 'Missing or invalid type field'};
     }

     if (req.body.type === 'Credit card' || req.body.type === 'Debit card') {
          const diff = _.difference(requiredCardFields, _.keys(req.body));
          if (!_.isEmpty(diff)) {
               throw {code: 400, message: `Missing credit card fields: ${diff.join(', ')}`};
          }
     }

     if (req.body.type === 'Bank account') {
          const diff = _.difference(requiredBankFields, _.keys(req.body));
          if (!_.isEmpty(diff)) {
               throw {code: 400, message: `Missing bank account fields: ${diff.join(', ')}`};
          }
     }

     let pa;
     if (req.body.usage === 'payment') {
          pa = await userService.attachPaymentMethodToUser({user: req.user, data: req.body});
     } else if (req.body.usage === 'payout') {
          pa = await userService.attachPayoutMethodToUser({user: req.user, data: req.body, ip: getIp(req), user_agent: req.headers['user-agent']}); //eslint-disable-line camelcase
     }

     console.log('Pa :', pa);
     const fields = ['id', 'type', 'brand', 'endingWith', 'isDefault', 'exp_year', 'currency', 'exp_month', 'name', 'account_holder_type', 'account_holder_name'];
     res.status(201).json(_.pick(pa, fields));
}

export async function payout(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     await userService.payoutToUser({managedId: req.user.paymentAccount.id, amount: +req.body.amount});
     res.status(201).end();
}

export async function deleteAccount(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     await userService.deleteAccountFromUser({user: req.user, accountId: req.params.accountId});
     res.status(204).end();
}

export async function setAsDefaultAccount(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     const account = await userService.setAsDefaultUserAccount({user: req.user, accountId: req.params.accountId});
     res.status(200).json(account);
}

export async function show(req, res) {
     const select = 'firstName lastName numeric imageUrl address businessName';
     const user = await User.findById(req.params.id, '-salt -password -verifications -notifications -accounts -paymentCustomer -paymentAccount')
          .populate([{path: 'following', select}, {path: 'followers', select}]).lean();
     if (!user) throw {code: 404, message: 'User not found'};
     res.status(200).json(user);
}

export async function near(req, res) {
     const query = {role: {$ne: 'admin'}};
     if (req.query.userId) {
          const coordinates = _.get(await User.findById(req.query.userId, 'address').lean(), 'address.coordinates');
          const distanceInMiles = 20;
          query['address.coordinates'] = {$geoWithin: {$centerSphere: [coordinates, distanceInMiles / 3963.2]}};
     }
     console.log('Query :', query);
     const users = await User.find(query).lean();
     res.status(200).json(users);
}

export async function stats(req, res) {
     const [[userStats], [availability]] = await Promise.all([
          Request.aggregate([
               {$match: {seller: new ObjectId(req.params.id), reactedAt: {$exists: true}}},
               {$project: {dateDifference: {$subtract: ['$reactedAt', '$createdAt']}}},
               {$group: {_id: null, avgResponse: {$avg: '$dateDifference'}}},
               {$project: {_id: 0, avgResponse: 1}}
          ]),
          Request.aggregate([
               {$match: {seller: new ObjectId(req.params.id), status: {$in: ['waiting', 'delivered', 'declined', 'expired']}}},
               {$group: {_id: null, total: {$sum: 1}, items: {$push: {status: '$status'}}}},
               {$project: {total: 1, approved: {$filter: {input: '$items', as: 'item', cond: {$or: [{$eq: ['$$item.status', 'waiting']}, {$eq: ['$$item.status', 'delivered']}]}}}}},
               {$project: {total: 1, approved: {$size: '$approved'}}},
               {$project: {_id: 0, availability: {$multiply: [{$divide: ['$approved', '$total']}, 100]}}}
          ])
     ]);
     res.status(200).json({avgResponse: _.get(userStats, 'avgResponse', 0), availability: _.get(availability, 'availability', 0)});
}

export async function changePassword(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     const userId = req.user._id;
     const oldPass = String(req.body.oldPassword);
     const newPass = String(req.body.newPassword);
     const user = await User.findById(userId);
     if (!user.authenticate(oldPass)) throw {code: 403, message: 'Invalid password'};
     user.password = newPass;
     await user.save();
     res.status(204).end();
}

export async function updateCurrentUser(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     const updatableFields = ['firstName', 'businessName', 'lastName', 'gender', 'about', 'email', 'phone', 'address', 'delivery', 'birthday'];
     const updateObject = _.pick(req.body, updatableFields);
     const user = await User.findById(req.params.id);
     if (!user) throw {code: 404, message: 'User not found'};
     _.extend(user, updateObject);
     await user.save();
     res.status(200).end();
}

export async function updateNotification(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     Reflect.deleteProperty(req.body, '_id');
     _.extend(req.user.notifications, req.body);
     await req.user.save();
     res.status(200).end();
}

export async function toggleFollowing(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     const index = _.indexOf(_.map(req.user.following, String), req.body.userId.toString());
     const user = await User.findById(req.body.userId);
     if (index === -1) {
          req.user.following.push(req.body.userId);
          user.followers.push(req.user._id);
          emitter.emit(events.USER_FOLLOWED, {user: user._id, follower: req.user._id});
     } else {
          req.user.following.splice(index, 1);
          user.followers.splice(_.indexOf(_.map(user.followers, String), req.user._id.toString()), 1);
     }
     req.user.numeric.following = req.user.following.length;
     user.numeric.followers = user.followers.length;
     await req.user.save();
     await user.save();
     await User.populate(req.user, {path: 'following', select: 'firstName lastName businessName numeric imageUrl address'});
     res.status(200).json(req.user.following);
}

export async function deactivate(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     req.user.active = false;
     await req.user.save();
     res.status(200).end();
}

export async function uploadProfileImage(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     req.user.imageUrl = await userService.uploadProfileImage(req.file.path, req.user);
     await req.user.save();
     res.status(200).send(req.user.imageUrl);
}

export async function sendResetEmail(req, res) {
     const user = await User.findOne({email: req.body.email}).lean();
     if (!user) throw {code: 404, message: 'Specified email address is not registered'};
     if (!user.verifications.email) throw {code: 400, message: `Hi ${user.businessName || user.firstName || 'there'}, looks like your email address is not verified.`};
     await userService.sendResetEmail(user);
     res.status(200).json({message: `Hi ${user.businessName || user.firstName || 'there'}, email with reset instructions for your account is successfully sent.`});
}

export async function resetPasswordWithToken(req, res) {
     const user = await User.findById({_id: req.body._id});
     if (!user) throw {code: 404, message: 'User not found'};
     user.password = req.body.password;
     await user.save();
     res.status(204).end();
}

export async function setPassword(req, res) {
     if (String(req.user._id) !== String(req.params.id)) throw {code: 403, message: 'Forbidden'};
     req.user.password = req.body.password;
     await req.user.save();
     res.status(204).end();
}

export async function me(req, res) {
     const population = [
          {path: 'followers', select: 'firstName lastName businessName numeric imageUrl address'},
          {path: 'following', select: 'firstName lastName businessName numeric imageUrl address'},
          {path: 'followingAuthors', select: 'firstName lastName corporateName numeric'}
     ];
     const user = await User.findOne({_id: req.user._id}, '-salt -__v').populate(population).lean();
     if (!user) throw {code: 401, message: 'Not authenticated'};
     user.password = !!user.password;
     res.status(200).json(user);
}

async function makeRequestAggregation(req, obj) {
     const statuses = _.castArray(req.query.statuses);
     const year = req.query.year;
     if (_.isEmpty(statuses) || !year) throw {code: 400, message: 'Bad request'};
     const query = _.extend({
          updatedAt: {$gte: new Date(moment(new Date(year)).startOf('year')), $lte: new Date(moment(new Date(year)).endOf('year'))},
          status: {$in: statuses}
     }, obj);
     return transformMonthlyAggregation(await Request.aggregate([
          {$match: query},
          {$group: {_id: {date: {$dateToString: {format: '%m', date: '$updatedAt'}}}, count: {$sum: 1}}},
          {$project: {month: '$_id.date', _id: 0, count: 1}}
     ]));
}
