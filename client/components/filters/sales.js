'use strict';

export function sales() {
     'ngInject';
     return salesFilter;

     function salesFilter(_sales, filter) {
          const conditionMet = el => _.isEmpty(filter.conditions) ? true : _.includes(filter.conditions, el.condition); //eslint-disable-line no-confusing-arrow
          const formatsMet = el => _.isEmpty(filter.formats) ? true : _.includes(filter.formats, el.format); //eslint-disable-line no-confusing-arrow
          const priceMet = el => filter.price.min <= el.price && filter.price.max >= el.price;
          const deliveryMet = el => _.size(filter.delivery) === 2 ? true : filter.delivery[0] === el.delivery; //eslint-disable-line no-confusing-arrow

          return _.filter(_sales, e => _.every([conditionMet(e), formatsMet(e), priceMet(e), deliveryMet(e)]));
     }
}
