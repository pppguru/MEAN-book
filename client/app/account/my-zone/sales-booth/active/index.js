'use strict';

import angular from 'angular';
import ActiveController from './active.controller';

export default angular.module('bookisApp.salesactive', [])
     .controller('ActiveController', ActiveController)
     .name;
