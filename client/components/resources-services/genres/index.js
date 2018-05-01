'use strict';

import angular from 'angular';
import {GenreResource} from './genres.resource';
import {GenreService} from './genres.service';

export default angular.module('bookisApp.genres', [])
     .service('GenreAPI', GenreResource)
     .service('genreService', GenreService)
     .name;
