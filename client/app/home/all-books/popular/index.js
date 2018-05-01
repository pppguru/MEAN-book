'use strict';

import angular from 'angular';
import PopularController from './popular.controller';

export default angular.module('bookisApp.popular', [])
     .controller('PopularController', PopularController)
     .name;
