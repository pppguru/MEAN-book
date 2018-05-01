'use strict';

export function BookReviewService(BookReviewAPI, bookReplyService, toast, Util, Auth, $q, appConfig) {
     'ngInject';
     const me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     const data = {
          reviews: []
     };
     return {
          getData: type => data[type],
          getBookReviews,
          createReview,
          replyToReview,
          getReviewReplies,
          toggleReviewLike,
          toggleReviewFlag
     };

     function createReview(review, book, rating) {
          _.extend(review, {user: me()._id, book: book._id});
          const newReview = new BookReviewAPI(review);
          return newReview.$save()
               .then(rew => {
                    rew.user = _.pick(me(), ['firstName', 'lastName', 'imageUrl', '_id']);
                    rew.user.userRating = _.get(rating, '[0].rate', 0);
                    rew.amFilter = true;
                    rew.collapsed = true;
                    data.reviews.unshift(rew);
                    toast.simple('You successfully reviewed book.');
                    return rew;
               })
               .catch(err => console.log(err));
     }

     function getBookReviews({book, userId, limit = appConfig.reviewsPerFetch, skip = data.reviews.length}) {
          const query = {book: book._id, limit, skip};
          if (userId) _.extend(query, {userId});
          return BookReviewAPI.query(query).$promise
               .then(reviews => {
                    if (!skip) {
                         Util.bindArray(data.reviews, reviews);
                    } else {
                         data.reviews.push(...reviews);
                    }
                    return reviews;
               })
               .catch(err => console.log(err));
     }

     function replyToReview(book, review, reply) {
          return bookReplyService.createReviewReply(book, review, reply)
               .then(rep => {
                    const index = _.findIndex(data.reviews, {_id: review._id});
                    if (!data.reviews[index].replies) data.reviews[index].replies = [];
                    rep.user = _.pick(me(), ['firstName', 'lastName', 'imageUrl']);
                    data.reviews[index].replies.push(rep);
                    data.reviews[index].noReplies = data.reviews[index].replies.length;
                    if (!data.reviews[index].fetched) data.reviews[index].fetched = 0;
                    data.reviews[index].fetched++;
                    return data.reviews[index].replies;
               })
               .catch(err => console.log(err));
     }

     function getReviewReplies(book, review, amount = appConfig.repliesPerFetch) {
          const index = _.findIndex(data.reviews, {_id: review._id});
          const fetched = data.reviews[index].fetched;
          const cached = data.reviews[index].cached ? data.reviews[index].cached.length : 0;
          if (cached && cached > fetched) {
               return $q.when(_.slice(data.reviews[index].cached, fetched, fetched + amount)).then(rep => {
                    data.reviews[index].replies.push(...rep);
                    data.reviews[index].fetched = data.reviews[index].replies.length;
               });
          }
          return bookReplyService.getReviewReplies(book, review, amount, data.reviews[index].fetched || 0)
               .then(rep => {
                    if (!data.reviews[index].replies) data.reviews[index].replies = [];
                    data.reviews[index].replies.push(...rep);
                    data.reviews[index].fetched = data.reviews[index].replies.length;
                    return data.reviews[index].replies;
               })
               .catch(err => console.log(err));
     }

     function toggleReviewLike({_id: book}, {_id}) {
          if (!me()._id) return;
          const index = _.findIndex(data.reviews, {_id});
          const newArray = _.xor(data.reviews[index].likes, [me()._id]);
          Util.bindArray(data.reviews[index].likes, newArray);
          BookReviewAPI.toggleReviewLike({book, _id}).$promise
               .then(resp => {
                    Util.bindArray(data.reviews[index].likes, resp);
                    return resp;
               })
               .catch(err => {
                    console.log('Err :', err);
               });
     }

     function toggleReviewFlag({_id: book}, {_id}) {
          if (!me()._id) return;
          const index = _.findIndex(data.reviews, {_id});
          const newArray = _.xor(data.reviews[index].flags, [me()._id]);
          Util.bindArray(data.reviews[index].flags, newArray);
          BookReviewAPI.toggleReviewFlag({book, _id}).$promise
               .then(resp => {
                    Util.bindArray(data.reviews[index].flags, resp);
                    return resp;
               })
               .catch(err => {
                    console.log('Err :', err);
               });
     }
}
