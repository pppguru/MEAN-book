'use strict';

import angular from 'angular';
import {CourseService} from './course.service';
import {CourseResource} from './course.resource';

export default angular.module('bookisApp.courses', [])
     .service('CourseAPI', CourseResource)
     .service('courseService', CourseService)
     .name;
