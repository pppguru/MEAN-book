'use strict';
// @flow

export default class ResetController {
     password:string;
     confirmPassword:string;
     token:string;
     message:string;
     userService;

     /*@ngInject*/
     constructor($stateParams, userService) {
          this.token = _.get($stateParams, 'id');
          this.userService = userService;
          this.message = '';
     }

     reset() {
          this.userService.resetPasswordWithToken({token: this.token, password: this.password})
               .then(() => {
                    this.message = 'Success!';
               })
               .catch(err => console.log(err));
     }

}
