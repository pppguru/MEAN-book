'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     // default states
     $urlRouterProvider.when('/my-zone/settings', '/my-zone/settings/account');

     $stateProvider
          .state('myzone.settings.password', {
               url: '/password',
               template: require('./password/password.html'),
               controller: 'PasswordController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.settings.account', {
               url: '/account',
               template: require('./my-account/my-account.html'),
               controller: 'MyAccountController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.settings.notifications', {
               url: '/notifications',
               template: require('./notifications/notifications.html'),
               controller: 'UpdateNotificationsController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.settings.deliverydetails', {
               url: '/delivery-details',
               template: require('./delivery-details/delivery-details.html'),
               controller: 'DeliveryDetailsController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.settings.payments', {
               url: '/payments',
               template: require('./payments/payments.html'),
               controller: 'PaymentsController',
               controllerAs: 'vm',
               authenticate: true
          });
}
