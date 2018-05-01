'use strict';

import moment from 'moment';
import mongoose from 'mongoose';
const {Types: {ObjectId}} = mongoose;

const formatDate = (format, date) => ({$dateToString: {format, date}});

export const requestsAggregation = (year = moment().year().toString(), statusArray, usersArray) => {
     const aggregation = [{
          $match: {
               createdAt: {
                    $gte: new Date(moment(new Date(year)).startOf('year')),
                    $lte: new Date(moment(new Date(year)).endOf('year'))
               }
          }
     }, {
          $group: {
               _id: {
                    date: formatDate('%m', '$createdAt')
               },
               count: {$sum: 1}
          }
     }, {
          $project: {
               _id: 0,
               month: '$_id.date',
               count: 1
          }
     }];
     if (statusArray) {
          aggregation[0].$match.status = {$in: statusArray};
     }
     if (usersArray && !_.isEmpty(usersArray)) {
          aggregation[0].$match.user = {$in: _.map(usersArray, e => new ObjectId(e))};
     }
     return aggregation;
};

