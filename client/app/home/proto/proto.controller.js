'use strict';
// @flow

export default class StaticController {
		 Auth;
     Modal;
     userService;
     me;
     /*@ngInject*/
     constructor(Modal, userService, Auth) {
          this.Auth = Auth;
          this.Modal = Modal;
          this.userService = userService;
          this.me = Auth.getCurrentUserSync();
     }

     newPaymentMethod() {
          this.Modal.newPaymentMethod().then(this.userService.createAccount);
     }

     setAsDefault({account: data}) {
          this.Modal.confirm('Set as default').then(() => {
               this.userService.setAsUserDefaultAccount({type: 'payment', data});
          });
     }

     removePaymentMethod({account: data}) {
          this.Modal.confirm('Delete card').then(() => {
               this.userService.deleteAccount({type: 'payment', data});
          });
     }


     
     links = [{
          title: 'Shopping Cart',
          state: '.cart'
     }, {
          title: 'Checkout',
          state: '.checkout'
     }, {
          title: 'Thank You!',
          state: '.thanks'
     }
     ];

}

