'use strict';

import angular from 'angular';
import AuthorProfileController from './author.profile.controller';

export default angular.module('bookisApp.authorprofilecommunity', [])
     .controller('AuthorProfileController', AuthorProfileController)
     .name;
