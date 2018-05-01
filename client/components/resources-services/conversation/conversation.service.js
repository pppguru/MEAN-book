'use strict';

export function ConversationService(ConversationAPI) {
     'ngInject';
     return {
          getConversationMessages
     };

     function getConversationMessages({_id: id}) {
          return ConversationAPI.getConversationMessages({id}).$promise
               .then(messages => messages)
               .catch(err => console.log(err));
     }
}
