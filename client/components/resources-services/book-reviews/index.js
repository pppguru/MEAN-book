'use strict';

import angular from 'angular';
import constants from '../../../app/app.constants';
import {BookReviewService} from './book-review.service';
import {BookReviewResource} from './book-review.resource';

export default angular.module('bookisApp.bookreview', [constants])
     .service('BookReviewAPI', BookReviewResource)
     .service('bookReviewService', BookReviewService)
     .name;
