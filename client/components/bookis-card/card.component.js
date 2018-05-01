import angular from 'angular';

export class BookisCardController {
     images;
     /*@ngInject*/
     constructor(appConfig) {
          'ngInject';
          this.images = appConfig.payments.supported.cardImages;
     }
}

export default angular.module('bookisApp.bookiscard', [])
     .component('bookisCard', {
          template: require('./card.html'),
          bindings: {
               card: '<',
               setDefault: '&?',
               remove: '&?',
               newPayment: '&?'
          },
          controllerAs: 'vm',
          controller: BookisCardController
     })
     .name;
