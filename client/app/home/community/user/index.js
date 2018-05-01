'use strict';

import angular from 'angular';
import UserProfileController from './user.profile.controller';

export default angular.module('bookisApp.userprofilecommunity', [])
     .controller('UserProfileController', UserProfileController)
     .name;
