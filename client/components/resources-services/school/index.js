'use strict';

import angular from 'angular';
import {SchoolService} from './school.service';
import {SchoolResource} from './school.resource';

export default angular.module('bookisApp.schools', [])
     .service('SchoolAPI', SchoolResource)
     .service('schoolService', SchoolService)
     .name;
