'use strict';

import angular from 'angular';
import UserMapCard from '../../../components/user-map-card/user.map.card';

import NearController from './near.controller';
import {MapService} from './map.service';

export default angular.module('bookisApp.near', [UserMapCard])
     .controller('NearController', NearController)
     .factory('mapService', MapService)
     .name;
