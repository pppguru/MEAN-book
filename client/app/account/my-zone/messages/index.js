'use strict';

import angular from 'angular';
import MessagesController from './messages.controller';
import messageItem from '../../../../components/message-item.component/message-item.component';

export default angular.module('bookisApp.messages', [messageItem])
     .controller('MessagesController', MessagesController)
     .name;
