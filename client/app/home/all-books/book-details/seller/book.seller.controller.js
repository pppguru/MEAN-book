'use strict';
// @flow

export default class BookSellerController {
     user;
     sales;
     wishlist;
     bookshelf;
     /*@ngInject*/
     constructor(userService, user, $stateParams, notificationService) {
          userService.getUserPublicWishList({_id: $stateParams.uid});
          userService.getUserSales({_id: $stateParams.uid});
          userService.getUserPublicBookshelf({_id: $stateParams.uid});
          notificationService.getNotifications({userId: $stateParams.uid}).then(notifications => {
               this.notifications = notifications
          });
          this.user = user;
          this.sales = userService.getData('sales', 'all');
          this.wishlist = userService.getWishList('public');
          this.bookshelf = userService.getBookShelf('public');
     }
}
