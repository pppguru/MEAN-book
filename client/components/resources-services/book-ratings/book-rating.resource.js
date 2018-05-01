'use strict';

export function BookRatingResource($resource) {
     'ngInject';

     return $resource('/api/books/:bookId/ratings/:id', {
          id: '@_id', bookId: '@bookId'
     }, {
          update: {
               method: 'PATCH'
          },
          getRatingsAggregation: {
               method: 'GET',
               isArray: true,
               params: {
                    id: 'aggregation'
               }
          },
          getMyRating: {
               method: 'GET',
               isArray: true
          }
     });
}
