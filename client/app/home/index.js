'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './home.routes';
import allBooks from './all-books';
import kids from './kids';
import staticRoute from './static';
import protoRoute from './proto';
import student from './student';
import top100 from './top100';
import near from './near';
import community from './community';
import sellbooks from './sell-books';
import advanced from './advanced';
import course from '../../components/resources-services/course';
import school from '../../components/resources-services/school';
import study from '../../components/resources-services/studies';

export default angular.module('bookisApp.home', [uiRouter, allBooks, kids, student, top100, community, sellbooks, advanced, course, school, study, staticRoute, protoRoute, near])
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
