'use strict';
// @flow

export default class SalesBoothController {
     currentNavItem:string;
     navigationItems;
     getLength = arrays => _.reduce(arrays, (agg, array) => agg + array.length, 0);
     /*@ngInject*/
     constructor($state, userService) {
          this.navigationItems = [{
               title: 'Requested',
               state: '.requested',
               number: userService.getRequests(['requested'], 'sent', 'all'),
               unseen: userService.getRequests(['requested'], 'sent', 'unseen')
          }, {
               title: 'Completed',
               state: '.completed',
               number: userService.getRequests(['delivered'], 'sent', 'all'),
               unseen: userService.getRequests(['delivered'], 'sent', 'unseen')
          }];
          const title = _.capitalize($state.current.url.substring(1).replace(/-/g, ' '));
          this.currentNavItem = _.findIndex(this.navigationItems, {title});
     }
}
