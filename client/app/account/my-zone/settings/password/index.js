'use strict';

import angular from 'angular';
import PasswordController from './password.controller';

export default angular.module('bookisApp.password', [])
     .controller('PasswordController', PasswordController)
     .name;
