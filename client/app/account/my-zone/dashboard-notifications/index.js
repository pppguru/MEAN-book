'use strict';

import angular from 'angular';
import DashboardController from './dashboard.controller';

export default angular.module('bookisApp.dashboard', [])
     .controller('DashboardController', DashboardController)
     .name;
