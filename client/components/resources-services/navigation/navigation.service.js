'use strict';

export function NavigationService(userService, $timeout) {
     'ngInject';
     const data = {
          sticked: [false]
     };
     return {
          updateStickedState: state => $timeout(() => {data.sticked[0] = state}),
          getStickedState: () => data.sticked,
          getMyZone: isMerchant => [{
               title: 'Dashboard',
               state: '.dashboard',
               active: 'myzone.dashboard',
               icon: '/assets/images/dashboard.png',
               srcset: '/assets/images/dashboard@2x.png 2x, /assets/images/dashboard@3x.png 3x'
          }, {
               title: 'Messages',
               state: '.messages',
               active: 'myzone.messages',
               icon: '/assets/images/message.png',
               srcset: '/assets/images/message@2x.png 2x, /assets/images/message@3x.png 3x'
          }, {
               title: 'People',
               state: '.people',
               active: 'myzone.people',
               icon: '/assets/images/user.png',
               srcset: '/assets/images/user@2x.png 2x, /assets/images/user@3x.png 3x'
          }, {
               title: 'Sales',
               state: '.salesbooth.active',
               number: userService.getRequests(['pending', 'waiting', 'delivered'], 'incoming', 'unseen'),
               active: 'myzone.salesbooth',
               icon: '/assets/images/sales.png',
               srcset: '/assets/images/sales@2x.png 2x, /assets/images/sales@3x.png 3x'
          }, {
               title: 'Wishlist',
               state: '.wishlist',
               active: 'myzone.wishlist',
               hide: isMerchant,
               number: [userService.getWishList('all')],
               icon: '/assets/images/hearts.png',
               srcset: '/assets/images/hearts@2x.png 2x, /assets/images/hearts@3x.png 3x'
          }, {
               title: 'Bookshelf',
               state: '.bookshelf',
               active: 'myzone.bookshelf',
               hide: isMerchant,
               number: [userService.getBookShelf('all')],
               icon: '/assets/images/hearts.png',
               srcset: '/assets/images/hearts@2x.png 2x, /assets/images/hearts@3x.png 3x'
          }, {
               title: 'Orders',
               state: '.orderhistory.completed',
               active: 'myzone.orderhistory',
               hide: isMerchant,
               number: userService.getRequests(['requested', 'delivered'], 'sent', 'unseen'),
               icon: '/assets/images/bar-chart.png',
               srcset: '/assets/images/bar-chart@2x.png 2x, /assets/images/bar-chart@3x.png 3x'
          }, {
               title: 'Settings',
               state: '.settings',
               active: 'myzone.settings',
               icon: '/assets/images/settings.png',
               srcset: '/assets/images/settings@2x.png 2x, /assets/images/settings@3x.png 3x'
          }]
     };

}
