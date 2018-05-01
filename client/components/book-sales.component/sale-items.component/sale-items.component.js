import angular from 'angular';

export class SaleItemsController {
     sales;
     me;
     login;
     /*@ngInject*/
     constructor(Auth, Modal) {
          'ngInject';
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.login = Modal.login;
     }
}

export default angular.module('bookisApp.saleitems', [])
     .component('saleItems', {
          template: require('./sale-items.html'),
          bindings: {
               sales: '<',
               ititle: '@',
               requestBook: '&',
               sellBook: '&',
               notifyMe: '&',
               notified: '=',
               index: '='
          },
          controllerAs: 'si',
          controller: SaleItemsController
     })
     .name;
