'use strict';
// @flow

export default class UserProfileController {
     user;
     sales;
     wishlist;
     bookshelf;
     /*@ngInject*/
     constructor(userService, user, $stateParams, notificationService) {
          userService.getUserWishList({_id: $stateParams.id});
          userService.getUserSales({_id: $stateParams.id});
          userService.getUserBookshelf({_id: $stateParams.id});
          notificationService.getNotifications({userId: $stateParams.id}).then(notifications => {
               this.notifications = notifications
          });
          this.user = user;
          this.sales = userService.getData('sales', 'all');
          this.wishlist = userService.getWishList('public');
          this.bookshelf = userService.getBookShelf('public');
     }
}
