'use strict';
// @flow

export default class FollowingController {
     me;
     userService;
     authorService;
     /*@ngInject*/
     constructor(Auth, userService, me, authorService) {
          this.userService = userService;
          this.authorService = authorService;
          this.me = me;
     }

     unfollow({_id, type}) {
          this[`${type}Service`].toggleFollow(_id);
     }
}
