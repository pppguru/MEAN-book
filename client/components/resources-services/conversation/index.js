'use strict';

import angular from 'angular';
import {ConversationService} from './conversation.service';
import {ConversationResource} from './conversation.resource';

export default angular.module('bookisApp.conversationResources', [])
     .service('ConversationAPI', ConversationResource)
     .service('conversationService', ConversationService)
     .name;
