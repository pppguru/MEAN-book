'use strict';

export function BookshelfResource($resource) {
     'ngInject';

     return $resource('/api/bookshelfs/:id/:controller', {
          id: '@_id', controller: '@controller'
     }, {
          update: {
               method: 'PUT'
          }
     });
}
