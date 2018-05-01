'use strict';

export const transformMonthlyAggregation = arr => _.reduce(arr, (agg, el) => {
     const month = +el.month - 1;
     agg[month] += el.count;
     return agg;
}, _.fill(new Array(12), 0));
