'use strict';

import angular from 'angular';
import constants from '../../../app/app.constants';
import {BookService} from './book.service';
import {BookResource} from './book.resource';

export default angular.module('bookisApp.book', [constants])
     .service('BookAPI', BookResource)
     .service('bookService', BookService)
     .name;
