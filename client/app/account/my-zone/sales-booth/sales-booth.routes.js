'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     // default states
     $urlRouterProvider.when('/my-zone/sales-booth', '/my-zone/sales-booth/active');

     $stateProvider
          .state('myzone.salesbooth.active', {
               url: '/active',
               template: require('./active/active.html'),
               controller: 'ActiveController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.salesbooth.pending', {
               url: '/pending-requests',
               template: require('./pending/pending.html'),
               controller: 'PendingController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.salesbooth.waiting', {
               url: '/waiting-to-be-delivered',
               template: require('./waiting/waiting.html'),
               controller: 'WaitingController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.salesbooth.saleshistory', {
               url: '/sales-history',
               template: require('./sales-history/sales-history.html'),
               controller: 'SalesHistoryController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.salesbooth.condition', {
               url: '/book-conditions',
               template: require('./book-conditions.html'),
               authenticate: true
          });
}
