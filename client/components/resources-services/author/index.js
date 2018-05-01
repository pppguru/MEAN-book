'use strict';

import angular from 'angular';
import {AuthorService} from './author.service';
import {AuthorResource} from './author.resource';

export default angular.module('bookisApp.author', [])
     .service('AuthorAPI', AuthorResource)
     .service('authorService', AuthorService)
     .name;
