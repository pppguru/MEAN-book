'use strict';

import angular from 'angular';
import {WaitinglistResource} from './waitinglist.resource';
import {WaitinglistService} from './waitinglist.service';

export default angular.module('bookisApp.waitinglist', [])
     .service('WaitinglistAPI', WaitinglistResource)
     .service('waitinglistService', WaitinglistService)
     .name;
