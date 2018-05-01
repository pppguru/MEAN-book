'use strict';

export function BookReplyService(BookReplyAPI, toast, Auth, Util) {
     'ngInject';
     const me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getReviewReplies,
          createReviewReply,
          toggleReplyLike,
          toggleReplyFlag
     };

     function createReviewReply({_id: book}, {_id: reviewId}, reply) {
          const newReply = new BookReplyAPI({reply, book, reviewId, user: me()._id});
          return newReply.$save()
               .then(rep => {
                    toast.simple('You successfully replied to review.');
                    return rep;
               })
               .catch(err => console.log(err));
     }

     function getReviewReplies({_id: book}, {_id: reviewId}, limit, skip) {
          return BookReplyAPI.query({book, reviewId, limit, skip}).$promise
               .then(replies => replies)
               .catch(err => console.log(err));
     }

     function toggleReplyLike({_id: book}, review, {_id}) {
          if (!me()._id) return;
          const index = _.findIndex(review.replies, {_id});
          const newArray = _.xor(review.replies[index].likes, [me()._id]);
          Util.bindArray(review.replies[index].likes, newArray);
          BookReplyAPI.toggleReplyLike({book, reviewId: review._id, _id}).$promise
               .then(resp => {
                    Util.bindArray(review.replies[index].likes, resp);
                    return resp;
               })
               .catch(err => {
                    console.log('Err :', err);
               });
     }

     function toggleReplyFlag({_id: book}, review, {_id}) {
          if (!me()._id) return;
          const index = _.findIndex(review.replies, {_id});
          const newArray = _.xor(review.replies[index].flags, [me()._id]);
          Util.bindArray(review.replies[index].flags, newArray);
          BookReplyAPI.toggleReplyFlag({book, reviewId: review._id, _id}).$promise
               .then(resp => {
                    Util.bindArray(review.replies[index].flags, resp);
                    return resp;
               })
               .catch(err => {
                    console.log('Err :', err);
               });
     }
}
