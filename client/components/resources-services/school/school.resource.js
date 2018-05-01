'use strict';

export function SchoolResource($resource) {
     'ngInject';

     return $resource('/api/schools/:id/:controller', {
          id: '@_id', controller: '@controller'
     }, {
          updated: {
               method: 'PUT'
          }
     });
}
