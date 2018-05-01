'use strict';
// @flow

export default class SalesBoothController {
     currentNavItem:string;
     navigationItems;
     getLength = arrays => _.reduce(arrays, (agg, array) => agg + array.length, 0);
     /*@ngInject*/
     constructor($state, userService) {
          this.navigationItems = [{
               title: 'For Sale',
               state: '.active',
               number: userService.getData('sales', 'available')
          }, {
               title: 'Requests',
               state: '.pending',
               number: userService.fetchRequests('incoming', 'pending', 'all'),
               unseen: userService.getRequests(['pending'], 'incoming', 'unseen')
          }, {
               title: 'Awaiting delivery',
               state: '.waiting',
               number: userService.fetchRequests('incoming', 'waiting', 'all'),
               unseen: userService.getRequests(['waiting'], 'incoming', 'unseen')
          }, {
               title: 'Sales history',
               state: '.saleshistory',
               number: userService.fetchRequests('incoming', 'delivered', 'all'),
               unseen: userService.getRequests(['delivered'], 'incoming', 'unseen')
          }];
          const title = _.capitalize($state.current.url.substring(1).replace(/-/g, ' '));
          this.currentNavItem = _.findIndex(this.navigationItems, {title});
          if (title === 'Active') this.currentNavItem = 0;
     }
}
