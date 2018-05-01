'use strict';

import angular from 'angular';

export class BookisRatingController {
     /*@ngInject*/
     constructor() {
          'ngInject';
     }

}

export default angular.module('bookisApp.bookirating', [])
     .component('bookisRating', {
          template: require('./bookis-rating.html'),
          bindings: {
               rating: '<',
               background: '@',
               click: '&',
               dsbl: '<'
          },
          controllerAs: 'vm',
          controller: BookisRatingController
     })
     .name;
