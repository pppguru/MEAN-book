'use strict';

import angular from 'angular';
import FollowingController from './following.controller';

export default angular.module('bookisApp.following', [])
     .controller('FollowingController', FollowingController)
     .name;
