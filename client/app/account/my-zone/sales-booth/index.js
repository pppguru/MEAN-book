'use strict';

import angular from 'angular';
import SalesBoothController from './sales-booth.controller';
import active from './active';
import pending from './pending';
import waiting from './waiting';
import salesHistory from './sales-history';
import routing from './sales-booth.routes';

export default angular.module('bookisApp.salesbooth', [active, pending, waiting, salesHistory])
     .config(routing)
     .controller('SalesBoothController', SalesBoothController)
     .name;
