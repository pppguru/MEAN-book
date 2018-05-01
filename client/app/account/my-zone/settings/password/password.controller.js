'use strict';

export default class PasswordController {
     user = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
     };
     notLocal:boolean;
     errors = {
          other: undefined
     };
     userService;
     Auth;

     /*@ngInject*/
     constructor(userService, me) {
          this.userService = userService;
          this.notLocal = me.provider !== 'local' && !me.password;
     }

     setPassword(form) {
          this.userService.setPassword(this, form);
     }

     changePassword(form) {
          this.userService.changePassword(this, form);
     }

}
