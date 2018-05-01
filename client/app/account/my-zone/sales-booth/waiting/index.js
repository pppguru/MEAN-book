'use strict';

import angular from 'angular';
import WaitingController from './waiting.controller';

export default angular.module('bookisApp.saleswaiting', [])
     .controller('WaitingController', WaitingController)
     .name;
