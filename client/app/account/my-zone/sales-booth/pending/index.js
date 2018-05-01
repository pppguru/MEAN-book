'use strict';

import angular from 'angular';
import PendingController from './pending.controller';

export default angular.module('bookisApp.salespending', [])
     .controller('PendingController', PendingController)
     .name;
