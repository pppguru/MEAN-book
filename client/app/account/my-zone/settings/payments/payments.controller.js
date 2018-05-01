'use strict';
// @flow

export default class PaymentsController {
     Modal;
     userService;
     me;
     /*@ngInject*/
     constructor(me, Modal, userService) {
          this.Modal = Modal;
          this.userService = userService;
          this.me = me;
     }

     newPaymentMethod() {
          this.Modal.newPaymentMethod().then(this.userService.createAccount);
     }

     newPayoutMethod() {
          this.Modal.newPayoutMethod().then(this.userService.createAccount);
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

     removePayoutMethod(data) {
          this.Modal.confirm('Delete payout method').then(() => {
               this.userService.deleteAccount({type: 'payout', data});
          });
     }

     setAsDefaultPayout(data) {
          this.Modal.confirm('Set as default').then(() => {
               this.userService.setAsUserDefaultAccount({type: 'payout', data});
          });
     }
}
