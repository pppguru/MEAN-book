'use strict';

import angular from 'angular';
import DeliveryDetailsController from './delivery-details.controller';

export default angular.module('bookisApp.deliverydetails', [])
     .controller('DeliveryDetailsController', DeliveryDetailsController)
     .name;
