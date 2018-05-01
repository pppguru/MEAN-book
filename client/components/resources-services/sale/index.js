'use strict';

import angular from 'angular';
import {SaleService} from './sale.service';
import {SaleResource} from './sale.resource';

export default angular.module('bookisApp.sales', [])
     .service('SaleAPI', SaleResource)
     .service('saleService', SaleService)
     .name;
