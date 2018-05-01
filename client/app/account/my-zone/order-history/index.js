'use strict';

import angular from 'angular';
import OrderHistoryController from './order-history.controller';
import routing from './order-history.routes';
import completed from './completed';
import requested from './requested';

export default angular.module('bookisApp.orderhistory', [completed, requested])
     .config(routing)
     .controller('OrderHistoryController', OrderHistoryController)
     .name;
