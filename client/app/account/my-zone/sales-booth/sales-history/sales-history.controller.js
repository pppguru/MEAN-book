'use strict';
// @flow

export default class SalesHistoryController {
     currentYear;
     userService;
     /*@ngInject*/
     constructor(userService, moment) {
          this.requests = userService.fetchRequests('incoming', 'delivered', 'all');
          this.totalAmount = () => _.sumBy(this.requests, 'book.price');
          this.currentYear = moment().year();
          this.userService = userService;
          userService.markAsSeen('incoming', ['delivered'], 'seller');
          userService.getRequestsAggregation('incoming', undefined, this.currentYear, ['delivered'])
               .then(data => {
                    this.data = data;
               });
     }

     refreshChart(op) {
          op === '+' ? this.currentYear++ : this.currentYear--;
          this.userService.getRequestsAggregation('incoming', undefined, this.currentYear, ['delivered']);
     }

}
