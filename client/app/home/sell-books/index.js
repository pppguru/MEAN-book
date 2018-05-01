'use strict';

import angular from 'angular';
import SellBooksController from './sell-books.controller';

export default angular.module('bookisApp.sellbooks', [])
     .controller('SellBooksController', SellBooksController)
     .name;
