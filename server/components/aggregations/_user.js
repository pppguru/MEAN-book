'use strict';

import moment from 'moment';

const formatDate = (format, date) => ({$dateToString: {format, date}});

export const userAggregation = (year = moment().year().toString(), role = 'user') => [{
     $match: {
          role,
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

