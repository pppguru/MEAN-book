'use strict';

import angular from 'angular';
import routing from './proto.routes';
import ProtoController from './proto.controller';
import card from '../../../components/bookis-card/card.component';


export default angular.module('bookisApp.proto', [card])
     .config(routing)
     .controller('ProtoController', ProtoController)
     .name;
 