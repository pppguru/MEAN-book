'use strict';

export function collapsibleFilterItem() {
     'ngInject';
     return {
          restrict: 'E',
          transclude: true,
          scope: {
               iTitle: '=',
               collapsed: '='
          },
          template: `
               <div flex="none" layout="column">
                    <div layout="row" layout-align="space-between" flex="none" class="filter-item-header" ng-click="collapsed = !collapsed">
                         <div class="filter-item-title" flex>{{iTitle | translate}}</div>
                         <md-icon ng-if="collapsed" flex="none" md-svg-src="assets/svg/chevron-down.svg" aria-label="select-down"></md-icon>
                         <md-icon ng-if="!collapsed" flex="none" md-svg-src="assets/svg/chevron-up.svg" aria-label="select-down"></md-icon>
                    </div>
                    <div flex="none" uib-collapse="collapsed">
                         <ng-transclude></ng-transclude>
                    </div>
               </div>
          `
     };
}
