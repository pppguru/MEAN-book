'use strict';

import angular from 'angular';
import BookSellersController from './book.sellers.controller';

export default angular.module('bookisApp.booksellers', [])
     .controller('BookSellersController', BookSellersController)
     .name;
