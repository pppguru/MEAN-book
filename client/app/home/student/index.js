'use strict';

import angular from 'angular';
import StudentController from './student.controller';

export default angular.module('bookisApp.student', [])
     .controller('StudentController', StudentController)
     .name;
