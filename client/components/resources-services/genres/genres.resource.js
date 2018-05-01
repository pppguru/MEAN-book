'use strict';

export function GenreResource($resource) {
     'ngInject';

     return $resource('/api/genres/:id/:controller', {
          id: '@_id', controller: '@controller'
     }, {
          update: {
               method: 'PUT'
          },
          getAll: {
               cache: true,
               method: 'GET',
               isArray: true
          },
          getMainGenres: {
               method: 'GET',
               isArray: true,
               params: {
                    controller: 'maingenres'
               }
          }
     });
}
