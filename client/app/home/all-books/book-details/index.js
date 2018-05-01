'use strict';

import angular from 'angular';
import BookDetailsController from './book-details.controller';
import bookSeller from './seller';
import bookSellers from './sellers';
import bookAuthor from './author';
import routing from './book-details.routes';

export default angular.module('bookisApp.bookdetails', [bookSeller, bookSellers, bookAuthor])
     .config(routing)
     .controller('BookDetailsController', BookDetailsController)
     .name;
