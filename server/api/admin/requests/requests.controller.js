'use strict';

import Requests from '../../request/request.model';
import {requestsAggregation} from '../../../components/aggregations/_requests';
import {transformMonthlyAggregation} from '../../../components/aggregations/utils';

export async function index(req, res) {
     res.status(200).json(await Requests.find()
          .populate({path: 'sale', populate: {path: 'book', model: 'Book', populate: {path: 'author', model: 'Author'}}})
          .populate('user', 'firstName lastName businessName imageUrl')
          .populate('seller', 'firstName lastName businessName imageUrl').lean());
}

export async function aggregation(req, res) {
     const year = _.get(req, 'query.year');
     const users = _.filter(_.castArray(_.get(req, 'query.users')));
     const aggregationData = _.map(await Promise.all([
          Requests.aggregate(requestsAggregation(year, undefined, users)),
          Requests.aggregate(requestsAggregation(year, ['pending', 'waiting', 'delivered'], users))
     ]), transformMonthlyAggregation);
     res.status(200).json(aggregationData);
}
