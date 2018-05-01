'use strict';

import User from '../../user/user.model';
import Bookshelf from '../../bookshelf/bookshelf.model';
import Wishlist from '../../wishlist/wishlist.model';
import Sale from '../../sale/sale.model';
import {transformMonthlyAggregation} from '../../../components/aggregations/utils';
import {userAggregation} from '../../../components/aggregations/_user';

export async function index(req, res) {
     const users = await User.find({}, '-salt -password -__v').lean();
     await Promise.all(_.map(users, attachMetaData));
     res.status(200).json(users);
}

export async function indexMerchants(req, res) {
     const merchants = await User.find({role: 'merchant'}, 'firstName lastName businessName').lean();
     res.status(200).json(merchants);
}

export async function aggregation(req, res) {
     const year = _.get(req, 'query.year');
     const users = _.map(await Promise.all([
          User.aggregate(userAggregation(year, 'user')), User.aggregate(userAggregation(year, 'merchant'))
     ]), transformMonthlyAggregation);
     res.status(200).json(users);
}

export async function destroy(req, res) {
     await User.findByIdAndRemove(req.params.id);
     res.status(204).end();
}

async function attachMetaData(user) {
     const data = await Promise.all([
          Bookshelf.find({user: user._id}).count(),
          Wishlist.find({user: user._id}).count(),
          Sale.find({seller: user._id}).count()
     ]);
     const meta = {
          bookshelf: data[0],
          wishlist: data[1],
          sales: data[2]
     };
     return _.extend(user, meta)
}