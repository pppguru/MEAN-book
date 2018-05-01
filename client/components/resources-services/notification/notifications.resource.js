'use strict';

export function NotificationsResource($resource) {
     'ngInject';

     return $resource('/api/notifications/:id/:controller', {
          id: '@_id', controller: '@controller'
     }, {
          update: {
               method: 'PUT'
          }
     });
}
