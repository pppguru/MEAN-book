'use strict';
// @flow

export default class PendingController {
     Modal;
     requests;
     userService;
     /*@ngInject*/
     constructor(Modal, userService) {
          this.Modal = Modal;
          this.userService = userService;
          this.requests = userService.fetchRequests('incoming', 'pending', 'all');
          userService.markAsSeen('incoming', ['pending'], 'seller');
     }

     approveRequest(request) {
          this.Modal.confirm('Approve', request.sale.book.title)
               .then(() => this.userService.approveRequest(request))
               .catch(err => console.log('err', err));
     }

     declineRequest(request) {
          this.Modal.rejectWithReason('decline', request.sale.book.title)
               .then(({reason}) => {
                    request.reason = reason;
                    this.userService.declineRequest(request);
               })
               .catch(err => console.log('err', err));
     }
}
