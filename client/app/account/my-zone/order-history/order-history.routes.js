'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('myzone.orderhistory.completed', {
               url: '/completed',
               template: require('./completed/completed.html'),
               controller: 'CompletedOrdersController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.orderhistory.requested', {
               url: '/requested',
               template: require('./requested/requested.html'),
               controller: 'RequestedOrdersController',
               controllerAs: 'vm',
               authenticate: true
          });
}
