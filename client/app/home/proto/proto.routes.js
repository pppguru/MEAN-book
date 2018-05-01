'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     //default states
     $urlRouterProvider.when('/proto', '/cart');

     $stateProvider
          .state('proto.cart', {
               url: '/cart',
               template: require('./cart/cart.html'),
               authenticate: false
          })
          .state('proto.checkout', {
               url: '/checkout',
               template: require('./checkout/checkout.html'),
               resolve: {me},
               authenticate: true
          })
          .state('proto.thanks', {
               url: '/thanks',
               template: require('./thanks/thanks.html'),
               authenticate: false
          });
}
const me = Auth => Auth.getCurrentUser(me => me)