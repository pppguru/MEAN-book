'use strict';

import angular from 'angular';

export class BookisSelectController {
     field;
     trans;
     selectOption;
     /*@ngInject*/
     constructor() {
          'ngInject';
          this.mychange = (type, value) => {
               this.change({type, value});
          };
          this.$onInit = () => {
               const option = this.field ? 'option as option[vm.field]' : 'option';
               const translate = this.trans ? '| translate' : '';
               this.selectOption = `${option} ${translate} for option in vm.options`;
          };
     }
}

export default angular.module('bookisApp.bookisselect', [])
     .component('bookisSelect', {
          template: require('./bookis-select.html'),
          bindings: {
               placeholder: '@',
               name: '@',
               model: '=',
               options: '<',
               required: '<',
               trans: '<',
               change: '&?',
               disabled: '=',
               field: '@',
               id: '@'
          },
          controllerAs: 'vm',
          controller: BookisSelectController
     })
     .name;
