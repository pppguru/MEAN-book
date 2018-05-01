'use strict';
// @flow

export default class FollowersController {
     me;
     userService;
     authorService;
     /*@ngInject*/
     constructor(me, userService, authorService) {
          this.me = me;
          this.userService = userService;
          this.authorService = authorService;
     }

     follow({_id, type}) {
          this[`${type}Service`].toggleFollow(_id);
     }

}
