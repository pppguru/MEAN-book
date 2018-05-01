'use strict';

import angular from 'angular';
import {chartService} from './chart.service';

export default angular.module('directives.bookischart', [])
     .service('chart', chartService)
     .name;
