'use strict';
// @flow

export default class DashboardController {
     notifications;
     reads;
     wishlist;
     available;
     sold;
     me;
     /*@ngInject*/
     constructor(notificationService, Auth, userService) {
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          notificationService.getNotifications({userId: this.me()._id}).then(no => {
               this.notifications = no;
          });
          this.reads = userService.getBookShelf('read');
          this.wishlist = userService.getWishList('all');
          this.available = userService.getData('sales', 'available');
          this.sold = userService.getData('sales', 'sold');
     }
}
