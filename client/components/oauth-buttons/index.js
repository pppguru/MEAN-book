'use strict';

import angular from 'angular';

export function OauthButtonsController($window) {
     'ngInject';
     this.loginOauth = (provider, remember) => {
          $window.location.href = `/auth/${provider}?redirect=${$window.location.pathname}&remember=${!!remember}`;
     };
}

export default angular.module('bookisApp.oauthButtons', [])
     .directive('oauthButtons', () => {//eslint-disable-line arrow-body-style
          return {
               template: require('./oauth-buttons.html'),
               restrict: 'EA',
               controller: OauthButtonsController,
               controllerAs: 'OauthButtons',
               scope: {
                    classes: '@',
                    remember: '=',
                    action: '@'
               }
          };
     })
     .name;
