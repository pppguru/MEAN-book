'use strict';

import angular from 'angular';
import RequestedOrdersController from './requested.controller';

export default angular.module('bookisApp.requestedOrders', [])
     .controller('RequestedOrdersController', RequestedOrdersController)
     .name;
