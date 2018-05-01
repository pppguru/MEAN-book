'use strict';

export function salePrice($http, appConfig) {
     'ngInject';
     let buyerFee = null;
     let serviceInvoked = false;
     const {transactions: {fees, fees: {def}, calculations: {stripeProcessingFee, bookisServiceFee}}} = appConfig;

     function priceFilter(value) {
          if (!value) return;
          const service = bookisServiceFee({base: +value, buyer: buyerFee});
          const processing = +stripeProcessingFee({base: +value + +service.buyer, fee: fees[def]});
          return _.round(+value + +service.buyer + +processing, 0);
     }

     asyncWrapper.$stateful = true;
     function asyncWrapper(value) {
          if (buyerFee !== null) return priceFilter(value);
          if (serviceInvoked) return '-';
          serviceInvoked = true;
          $http.get('/api/constants/fees').then(({data: {buyer}}) => {
               buyerFee = +buyer;
          });
     }
     return asyncWrapper;
}
