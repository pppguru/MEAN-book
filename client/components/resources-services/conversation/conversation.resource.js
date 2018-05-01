'use strict';

export function ConversationResource($resource) {
     'ngInject';

     return $resource('/api/conversations/:id/:controller', {
          id: '@_id'
     }, {
          getConversationMessages: {
               method: 'GET',
               isArray: true,
               params: {
                    controller: 'messages'
               }
          }
     });
}
