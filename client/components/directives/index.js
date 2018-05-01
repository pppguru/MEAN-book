'use strict';

import angular from 'angular';
import {mongoose} from './mongoose-error';
import {webcam} from './webcam';
import {allowedChars} from './allowed-chars';
import {scrollGlue} from './scroll-glue';
import {collapsibleFilterItem} from './collapsible-filter-item';

export default angular.module('bookisApp.directives', [])
     .directive('mongooseError', mongoose)
     .directive('allowedChars', allowedChars)
     .directive('scrollGlue', scrollGlue)
     .directive('webcam', webcam)
     .directive('collapsibleFilterItem', collapsibleFilterItem)
     .name;
