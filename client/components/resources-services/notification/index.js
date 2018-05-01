'use strict';

import angular from 'angular';
import {NotificationsResource} from './notifications.resource';
import {NotificationService} from './notifications.service';

export default angular.module('bookisApp.notifications', [])
     .service('NotificationAPI', NotificationsResource)
     .service('notificationService', NotificationService)
     .name;
