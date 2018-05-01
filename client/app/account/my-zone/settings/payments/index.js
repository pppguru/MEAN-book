'use strict';

import angular from 'angular';
import PaymentsController from './payments.controller';
import card from '../../../../../components/bookis-card/card.component';

export default angular.module('bookisApp.payments', [card])
     .controller('PaymentsController', PaymentsController)
     .name;
