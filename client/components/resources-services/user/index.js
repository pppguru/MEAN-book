'use strict';

import angular from 'angular';
import constants from '../../../app/app.constants';
import util from '../../util/util.module';
import ngCookies from 'angular-cookies';
import {UserService} from './user.service';
import {UserResource} from './user.resource';

import uiRouter from 'angular-ui-router';

export default angular.module('bookisApp.user', [constants, util, ngCookies, uiRouter])
     .service('UserAPI', UserResource)
     .service('userService', UserService)
     .name;
