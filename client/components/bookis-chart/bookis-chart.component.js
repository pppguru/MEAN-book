'use strict';

import angular from 'angular';

export class BookisChartController {
     /*@ngInject*/
     constructor(chart) {
          'ngInject';
          _.extend(this, chart.orderHistoryChart());
     }
}

export default angular.module('bookisApp.bookischart', [])
     .component('bookisChart', {
          template: require('./bookis-chart.html'),
          bindings: {
               data: '<'
          },
          controllerAs: 'vm',
          controller: BookisChartController
     })
     .name;
