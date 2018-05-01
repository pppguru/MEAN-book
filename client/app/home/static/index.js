'use strict';

import angular from 'angular';
import routing from './static.routes';
import StaticController from './static.controller';

export default angular.module('bookisApp.static', [])
     .config(routing)
     .controller('StaticController', StaticController)
     .name;
