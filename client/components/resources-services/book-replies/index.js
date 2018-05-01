'use strict';

import angular from 'angular';
import constants from '../../../app/app.constants';
import {BookReplyService} from './book-replies.service';
import {BookReplyResource} from './book-replies.resource';

export default angular.module('bookisApp.bookreply', [constants])
     .service('BookReplyAPI', BookReplyResource)
     .service('bookReplyService', BookReplyService)
     .name;
