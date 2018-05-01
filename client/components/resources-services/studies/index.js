'use strict';

import angular from 'angular';
import {StudyService} from './study.service';
import {StudyResource} from './study.resource';

export default angular.module('bookisApp.studies', [])
     .service('StudyAPI', StudyResource)
     .service('studyService', StudyService)
     .name;
