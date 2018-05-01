'use strict';

import angular from 'angular';
import BookShelfController from './bookshelf.controller';

export default angular.module('bookisApp.bookshelf', [])
     .controller('BookShelfController', BookShelfController)
     .name;
