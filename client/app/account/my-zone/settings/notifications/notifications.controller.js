'use strict';
// @flow

export default class UpdateNotificationsController {
     me;
     userService;
     notifications = {
          followsMe: 'Notify when someone follows me',
          commentMyReview: 'Notify when someone comments on my reviews',
          replyMyComment: 'Notify when someone replies to my comment',
          upVoteMyComment: 'Notify when someone upvotes my comment',
          downVoteMyComment: 'Notify when someone downvotes my comment',
          message: 'Notify when someone messages me',
          interestingBook: 'Notify about interesting books',
          relevantBook: 'Notify about relevant book suggestions'
     };
     /*@ngInject*/
     constructor(me, userService) {
          this.me = me;
          this.userService = userService;
     }

     updateNotification(key) {
          this.userService.updateNotification(this.me._id, _.pick(this.me.notifications, [key]));
     }

}
