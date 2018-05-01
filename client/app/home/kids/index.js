'use strict';

import angular from 'angular';

import KidsController from './kids.controller';

export default angular.module('bookisApp.kids', [])
     .controller('KidsController', KidsController)
     .name;
