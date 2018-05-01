'use strict';

export function BookReviewResource($resource) {
     'ngInject';

     return $resource('/api/books/:book/reviews/:id/:controller', {
          id: '@_id', book: '@book'
     }, {
          toggleReviewLike: {
               method: 'POST',
               isArray: true,
               params: {
                    controller: 'likes'
               }
          },
          toggleReviewFlag: {
               method: 'POST',
               isArray: true,
               params: {
                    controller: 'flags'
               }
          }
     });
}
