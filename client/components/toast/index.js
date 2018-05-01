'use strict';

import angular from 'angular';

function toastService($mdToast) {
     'ngInject';
     let last = {
          bottom: false,
          top: true,
          left: false,
          right: true
     };

     const toastPosition = _.extend({}, last);

     const getToastPosition = () => {
          sanitizePosition();

          return Object.keys(toastPosition)
               .filter(pos => toastPosition[pos])
               .join(' ');
     };

     function sanitizePosition() {
          var current = toastPosition;

          if (current.bottom && last.top) current.top = false;
          if (current.top && last.bottom) current.bottom = false;
          if (current.right && last.left) current.left = false;
          if (current.left && last.right) current.right = false;

          last = _.extend({}, current);
     }

     function simple(message, time = 2000, position) {
          const pinTo = getToastPosition();
          $mdToast.show(
               $mdToast.simple()
                    .textContent(message)
                    .position(position || pinTo)
                    .parent(angular.element(document.querySelector('#main-ui-view')))
                    .theme('success-toast')
                    .hideDelay(time)
          );
     }

     function error(message, time = 2000, position) {
          const pinTo = getToastPosition();
          $mdToast.show(
               $mdToast.simple()
                    .textContent(message)
                    .position(position || pinTo)
                    .parent(angular.element(document.querySelector('#main-ui-view')))
                    .theme('error-toast')
                    .hideDelay(time)
          );
     }

     return {
          simple,
          error
     };
}

export default angular.module('directives.toast', [])
     .service('toast', toastService)
     .name;
