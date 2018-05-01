'use strict';

import angular from 'angular';
import FollowersController from './followers.controller';

export default angular.module('bookisApp.followers', [])
     .controller('FollowersController', FollowersController)
     .name;
