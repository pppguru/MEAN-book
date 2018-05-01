'use strict';
// @flow

export default class WaitingController {
     requests;
     userService;
     Modal;
     /*@ngInject*/
     constructor(Modal, userService) {
          this.Modal = Modal;
          this.userService = userService;
          this.requests = userService.fetchRequests('incoming', 'waiting', 'all');
          userService.markAsSeen('incoming', ['waiting'], 'seller');
     }

     markAsDelivered(request) {
          this.Modal.confirm('Mark as delivered', request.sale.book.title)
               .then(() => this.userService.deliverRequest(request))
               .catch(err => console.log('err', err));
     }
}
