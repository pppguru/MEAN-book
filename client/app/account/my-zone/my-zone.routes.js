'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     //default states
     $urlRouterProvider.when('/my-zone', '/my-zone/settings');

     $stateProvider
          .state('myzone.settings', {
               url: '/settings',
               controller: 'SettingsController',
               controllerAs: 'vm',
               template: require('./settings/settings.html'),
               authenticate: true
          })
          .state('myzone.orderhistory', {
               url: '/order-history',
               template: require('./order-history/order-history.html'),
               controller: 'OrderHistoryController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.dashboard', {
               url: '/dashboard',
               template: require('./dashboard-notifications/dashboard.html'),
               controller: 'DashboardController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.messages', {
               url: '/messages',
               params: { id: undefined },
               template: require('./messages/messages.html'),
               controller: 'MessagesController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.people', {
               url: '/people',
               template: require('./people/people.html'),
               controller: 'PeopleController',
               controllerAs: 'pe',
               authenticate: true
          })
          .state('myzone.salesbooth', {
               abstract: true,
               template: require('./sales-booth/sales-booth.html'),
               controller: 'SalesBoothController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.wishlist', {
               url: '/wishlist',
               template: require('./wishlist/wishlist.html'),
               controller: 'WishlistController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.bookshelf', {
               url: '/bookshelf',
               template: require('./bookshelf/bookshelf.html'),
               controller: 'BookShelfController',
               controllerAs: 'vm',
               authenticate: true
          });
}
