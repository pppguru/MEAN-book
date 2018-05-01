'use strict';

import angular from 'angular';
import Top100Controller from './top100.controller';

export default angular.module('bookisApp.top100', [])
     .controller('Top100Controller', Top100Controller)
     .name;
