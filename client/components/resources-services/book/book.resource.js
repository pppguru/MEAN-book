'use strict';

export function BookResource($resource) {
     'ngInject';

     return $resource('/api/books/:id/:controller', {
          id: '@_id'
     }, {
          editBook: {
               method: 'PUT'
          },
          getSuggested: {
               method: 'GET',
               isArray: true,
               params: {
                    controller: 'suggested'
               }
          },
          getRecommended: {
               method: 'GET',
               params: {
                    controller: 'recommended'
               }
          },
          kidsRecommended: {
               method: 'GET',
               isArray: true,
               params: {
                    id: 'kids',
                    controller: 'recommended'
               }
          },
          kidsPopular: {
               method: 'GET',
               isArray: true,
               params: {
                    id: 'kids',
                    controller: 'popular'
               }
          },
          autocomplete: {
               method: 'GET',
               params: {
                    id: 'autocomplete'
               }
          },
          getISBN: {
               method: 'GET',
               params: {
                    controller: 'isbn'
               }
          },
          getStudentBooks: {
               method: 'GET',
               isArray: true,
               params: {
                    id: 'students'
               }
          }
     });
}
