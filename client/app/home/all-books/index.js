'use strict';

import angular from 'angular';
import AllBooksController from './all-books.controller';
import details from './book-details';
import popular from './popular';
import routing from './all-books.routes';

export default angular.module('bookisApp.allbooks', [details, popular])
     .config(routing)
     .controller('AllBooksController', AllBooksController)
     .name;
