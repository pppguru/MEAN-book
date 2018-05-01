'use strict';

import angular from 'angular';
import CommunityController from './community.controller';
import routing from './community.routes';
import userProfile from './user';
import authorProfile from './author';

export default angular.module('bookisApp.community', [userProfile, authorProfile])
     .config(routing)
     .controller('CommunityController', CommunityController)
     .name;
