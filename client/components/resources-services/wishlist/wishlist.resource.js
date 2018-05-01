'use strict';

export function WishlistResource($resource) {
     'ngInject';

     return $resource('/api/wishlists/:id/:controller', {
          id: '@_id', controller: '@controller'
     }, {
          update: {
               method: 'PUT'
          }
     });
}
