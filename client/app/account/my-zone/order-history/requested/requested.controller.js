'use strict';
// @flow

export default class RequestedOrdersController {
     Modal;
     userService;
     /*@ngInject*/
     constructor(userService, Modal) {
          this.Modal = Modal;
          this.userService = userService;
          this.allRequests = userService.fetchRequests('sent', 'requested', 'all');
          console.log('This.allRequests :', this.allRequests);
          userService.markAsSeen('sent', ['requested'], 'user');
     }

     cancelRequest(request) {
          this.Modal.rejectWithReason('cancel', request.sale.book.title)
               .then(({reason}) => {
                    request.reason = reason;
                    this.userService.cancelRequest(request);
               })
               .catch(err => console.log('err', err));
     }

}
