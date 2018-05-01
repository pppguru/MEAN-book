'use strict';

export function AuthorResource($resource) {
     'ngInject';

     return $resource('/api/authors/:id/:controller/:type/:sub', {
          id: '@_id', type: '@_type'
     }, {
          getAuthorBooks: {
               method: 'GET',
               isArray: true,
               params: {
                    controller: 'books'
               }
          },
          toggleFollow: {
               method: 'PATCH',
               isArray: true,
               params: {
                    controller: 'following'
               }
          }
     });
}
