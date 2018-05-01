'use strict';

import angular from 'angular';
import routing from './settings.routes';
import SettingsController from './settings.controller';
import password from './password';
import myAccount from './my-account';
import notifications from './notifications';
import deliveryDetails from './delivery-details';
import payments from './payments';

export default angular.module('bookisApp.settings', [password, myAccount, notifications, deliveryDetails, payments])
     .config(routing)
     .controller('SettingsController', SettingsController)
     .name;
