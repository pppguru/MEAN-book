'use strict';

import angular from 'angular';
import {MessageService} from './message.service';
import {MessageResource} from './message.resource';

export default angular.module('bookisApp.messagesResources', [])
     .service('MessageAPI', MessageResource)
     .service('messageService', MessageService)
     .name;
