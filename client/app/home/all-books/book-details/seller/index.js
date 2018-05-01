'use strict';

import angular from 'angular';
import BookSellerController from './book.seller.controller';

export default angular.module('bookisApp.bookseller', [])
     .controller('BookSellerController', BookSellerController)
     .name;
