'use strict';

export function RequestService(RequestAPI, toast, Auth, Util) {
     'ngInject';
     const requests = [];
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getRequests,
          createRequest,
          approveRequest,
          declineRequest,
          deliverRequest,
          cancelRequest,
          markSeen,
          getRequestMessages,
          createMessage,
          getShippingMethods
     };

     function getRequests() {
          return RequestAPI.query().$promise
               .then(r => {
                    Util.bindArray(requests, r);
                    return requests;
               })
               .catch(err => console.log(err));
     }

     function getShippingMethods(zip, measures) {
          return RequestAPI.getShippingMethods(_.extend({zip}, measures)).$promise
               .then(r => r)
               .catch(err => console.log(err));
     }

     function getRequestMessages(req) {
          return RequestAPI.getRequestMessages({id: req._id}).$promise
               .then(rMess => rMess)
               .catch(err => console.log(err));
     }

     function createMessage({req, message}) {
          return RequestAPI.createMessage({_id: req._id, message}).$promise
               .then(createdMessage => createdMessage)
               .catch(err => console.log(err));
     }

     function createRequest(req) {
          if (!me()._id) return;
          req.user = me()._id;
          const request = new RequestAPI(req);
          return request.$save()
               .then(r => {
                    toast.simple('Book requested!');
                    return r;
               })
               .catch(err => console.log(err));
     }

     function approveRequest(request) {
          return RequestAPI.approve(request).$promise
               .then(r => {
                    toast.simple('Request approved!');
                    return r;
               })
               .catch(err => console.log(err));
     }

     function declineRequest(request) {
          return RequestAPI.decline(request).$promise
               .then(r => {
                    toast.simple('Request declined!');
                    return r;
               })
               .catch(err => console.log(err));
     }

     function deliverRequest(request) {
          return RequestAPI.deliver(request).$promise
               .then(r => {
                    toast.simple('Request marked as delivered!');
                    return r;
               })
               .catch(err => console.log(err));
     }

     function cancelRequest(request) {
          return RequestAPI.cancel(request).$promise
               .then(r => {
                    toast.simple('Request canceled!');
                    return r;
               })
               .catch(err => console.log(err));
     }

     function markSeen(unseenArray, controller) {
          return RequestAPI.markSeen({unseenArray, controller}).$promise;
     }
}
