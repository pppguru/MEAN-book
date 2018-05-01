'use strict';

export function MessageService(MessageAPI, toast) {
     'ngInject';
     return {
          createMessage
     };


     function createMessage(message) {
          const newMessage = new MessageAPI(message);
          return newMessage.$save()
               .then(m => m)
               .catch(err => {
                    console.log('Err :', err);
                    toast.error('Error while sending message!');
               });
     }
}
