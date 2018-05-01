'use strict';

import angular from 'angular';
import {BookshelfResource} from './bookshelf.resource';
import {BookshelfService} from './bookshelf.service';

export default angular.module('bookisApp.bookshelfs', [])
     .service('BookshelfAPI', BookshelfResource)
     .service('bookshelfService', BookshelfService)
     .name;
