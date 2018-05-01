'use strict';

import angular from 'angular';
import {
     UtilService
} from './util.service';

export default angular.module('bookisApp.util', [])
     .factory('Util', UtilService)
     .name;
