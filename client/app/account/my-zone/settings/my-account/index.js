'use strict';

import angular from 'angular';
import MyAccountController from './my-account.controller';

export default angular.module('bookisApp.myaccount', [])
     .controller('MyAccountController', MyAccountController)
     .name;
