'use strict';

export function RequestResource($resource) {
     'ngInject';

     return $resource('/api/requests/:id/:controller', {
          id: '@_id', controller: '@controller'
     }, {
          approve: {
               method: 'PATCH',
               params: {
                    controller: 'approve'
               }
          },
          decline: {
               method: 'PATCH',
               params: {
                    controller: 'decline'
               }
          },
          deliver: {
               method: 'PATCH',
               params: {
                    controller: 'deliver'
               }
          },
          cancel: {
               method: 'PATCH',
               params: {
                    controller: 'cancel'
               }
          },
          markSeen: {
               method: 'PATCH',
               params: {
                    id: 'seen'
               }
          },
          getRequestMessages: {
               method: 'GET',
               isArray: true,
               params: {
                    controller: 'messages'
               }
          },
          createMessage: {
               method: 'POST',
               params: {
                    controller: 'messages'
               }
          },
          getShippingMethods: {
               method: 'GET',
               isArray: true,
               params: {
                    id: 'methods'
               }
          }
     });
}
