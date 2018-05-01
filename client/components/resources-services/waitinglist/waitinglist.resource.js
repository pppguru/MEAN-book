'use strict';

export function WaitinglistResource($resource) {
     'ngInject';

     return $resource('/api/waitinglists/:id/:controller', {
          id: '@_id', controller: '@controller'
     }, {
          update: {
               method: 'PUT'
          }
     });
}
