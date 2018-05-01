'use strict';
// @flow

export default class CompletedOrdersController {
     Modal;
     userService;
     currentYear;
     /*@ngInject*/
     constructor(chart, moment, userService, Modal) {
          _.extend(this, chart.orderHistoryChart());
          this.Modal = Modal;
          this.userService = userService;
          this.currentYear = moment().year();
          userService.getRequestsAggregation('sent', undefined, this.currentYear, ['delivered'])
               .then(data => {
                    this.data = data;
               });
          this.requests = userService.fetchRequests('sent', 'delivered', 'all');
          userService.markAsSeen('sent', ['delivered'], 'user');
     }

     refreshChart(op) {
          op === '+' ? this.currentYear++ : this.currentYear--;
          this.userService.getRequestsAggregation('sent', undefined, this.currentYear, ['delivered']);
     }
}
