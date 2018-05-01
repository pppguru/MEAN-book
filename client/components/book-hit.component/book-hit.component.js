import angular from 'angular';

export class BookHitController {
     book;

     /*@ngInject*/
     constructor() {
          'ngInject';
     }

}

export default angular.module('bookisApp.bookhit', [])
     .component('bookHit', {
          template: require('./book-hit.html'),
          bindings: {
               book: '<'
          },
          controllerAs: 'vm',
          controller: BookHitController
     })
     .name;
