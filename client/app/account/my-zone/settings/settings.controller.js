'use strict';
// @flow

export default class SettingsController {
     currentNavItem:string;
     navigationItems = [{
          title: 'Account',
          state: '.account'
     }, {
          title: 'Password',
          state: '.password'
     }, {
          title: 'Notifications',
          state: '.notifications'
     }, {
          title: 'Payments',
          state: '.payments'
     }];
     /*@ngInject*/
     constructor($state) {
          console.log('setting init');
          const title = _.capitalize($state.current.url.substring(1).replace('-', ' '));
          this.currentNavItem = _.findIndex(this.navigationItems, {title});
          if (title === 'Settings') this.currentNavItem = 0;
     }

}
