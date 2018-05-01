'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './account.routes';
import myZone from './my-zone';
import verify from './verify';
import reset from './reset';
import oauthButtons from '../../components/oauth-buttons';

export default angular.module('bookisApp.account', [uiRouter, myZone, oauthButtons, verify, reset])
     .config(routing)
     .run($rootScope => {
          'ngInject';

          $rootScope.$on('$stateChangeStart', (event, next, nextParams, current) => {
               if (next.name === 'logout' && current && current.name && !current.authenticate) {
                    next.referrer = current.name;
               }
          });
     })
     .name;
