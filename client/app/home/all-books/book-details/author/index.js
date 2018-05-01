'use strict';

import angular from 'angular';
import BookAuthorController from './book.author.controller';

export default angular.module('bookisApp.bookauthor', [])
     .controller('BookAuthorController', BookAuthorController)
     .name;
