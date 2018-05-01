'use strict';

import angular from 'angular';
import constants from '../../../app/app.constants';
import {RequestService} from './request.service';
import {RequestResource} from './request.resource';

export default angular.module('bookisApp.request', [constants])
     .service('RequestAPI', RequestResource)
     .service('requestService', RequestService)
     .name;
