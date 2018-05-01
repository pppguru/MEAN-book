import angular from 'angular';

export class BookisSliderController {
     /*@ngInject*/
     constructor() {
          'ngInject';
     }
}

export default angular.module('bookisApp.slider', [])
     .component('bookisSlider', {
          template: require('./bookis-slider.html'),
          bindings: {
               options: '<',
               inputs: '<',
               values: '='
          },
          controllerAs: 'vm',
          controller: BookisSliderController
     })
     .name;
