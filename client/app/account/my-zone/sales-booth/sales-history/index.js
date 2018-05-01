'use strict';

import angular from 'angular';
import SalesHistoryController from './sales-history.controller';

export default angular.module('bookisApp.saleshistory', [])
     .controller('SalesHistoryController', SalesHistoryController)
     .name;
