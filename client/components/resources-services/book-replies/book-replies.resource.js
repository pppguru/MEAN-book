'use strict';

export function BookReplyResource($resource) {
     'ngInject';

     return $resource('/api/books/:book/reviews/:reviewId/replies/:id/:controller', {
          id: '@_id', reviewId: '@reviewId', book: '@book'
     }, {
          toggleReplyLike: {
               method: 'POST',
               isArray: true,
               params: {
                    controller: 'likes'
               }
          },
          toggleReplyFlag: {
               method: 'POST',
               isArray: true,
               params: {
                    controller: 'flags'
               }
          }
     });
}
