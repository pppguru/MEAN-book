'use strict';

import angular from 'angular';
import {NavigationService} from './navigation.service';

export default angular.module('bookisApp.navigation', [])
     .service('navigationService', NavigationService)
     .name;
