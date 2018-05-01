'use strict';

import angular from 'angular';
import constants from '../../../app/app.constants';
import {BookRatingService} from './book-rating.service';
import {BookRatingResource} from './book-rating.resource';

export default angular.module('bookisApp.bookrating', [constants])
     .service('BookRatingAPI', BookRatingResource)
     .service('bookRatingService', BookRatingService)
     .name;
