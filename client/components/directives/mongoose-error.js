'use strict';

/**
 * Removes server error when user updates input
 */
export function mongoose() {
     'ngInject';
     return {
          restrict: 'A',
          require: 'ngModel',
          link(scope, element, attrs, ngModel) {
               element.on('keydown', () => ngModel.$setValidity('mongoose', true));
          }
     };
}
