'use strict';

import angular from 'angular';
import CompletedOrdersController from './completed.controller';

export default angular.module('bookisApp.completedOrders', [])
     .controller('CompletedOrdersController', CompletedOrdersController)
     .name;
