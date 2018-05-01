'use strict';
// @flow

export default class VerifyController {
     status:boolean;
     token:string;
     message:string;

     /*@ngInject*/
     constructor($stateParams, userService) {
          this.token = _.get($stateParams, 'id');
          userService.verifyEmail(this.token)
               .then(() => {
                    this.status = true;
                    this.message = '';
               })
               .catch(({data: message}) => {
                    this.status = false;
                    this.message = message;
               });
     }

}
