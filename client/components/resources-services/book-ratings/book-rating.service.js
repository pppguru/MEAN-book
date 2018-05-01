'use strict';

export function BookRatingService(BookRatingAPI, toast, Util, Auth) {
     'ngInject';
     const data = {
          bookRatings: [],
          myRate: [],
          total: {rating: 0}
     };
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getRatingsAggregation,
          getMyRating,
          getData: type => data[type],
          createRating,
          updateRating,
          getTotal,
          getAverage,
          syncRates
     };

     function getRatingsAggregation(bookId) {
          return BookRatingAPI.getRatingsAggregation({bookId}).$promise
               .then(ratings => {
                    Util.bindArray(data.bookRatings, ratings);
                    data.total.rating = _.sum(data.bookRatings);
                    return data.bookRatings;
               })
               .catch(err => console.log(err));
     }

     function getMyRating(book) {
          if (!me()._id) {
               data.myRate.splice(0);
               return Promise.resolve([]);
          }
          return BookRatingAPI.getMyRating({bookId: book._id, userId: me()._id}).$promise
               .then(rating => {
                    Util.bindArray(data.myRate, rating);
                    return rating;
               })
               .catch(err => console.log(err));
     }

     function createRating(book, rate) {
          const newRating = new BookRatingAPI({
               user: me()._id,
               book: book._id,
               rate
          });
          return newRating.$save(_.extend(newRating, {bookId: book._id}))
               .then(r => {
                    data.myRate[0] = r;
                    toast.simple('Successfully rated book!');
                    return r.rate;
               })
               .catch(err => console.log(err));
     }

     function updateRating(rating, newRate) {
          const update = _.extend(rating[0], {rate: newRate});
          return BookRatingAPI.update(_.extend(update, {bookId: update.book})).$promise
               .then(r => {
                    data.myRate[0] = r;
                    toast.simple('Updated your rating!');
                    return r.rate;
               })
               .catch(err => console.log(err));
     }

     function syncRates(rate, oldRate, collection = data.bookRatings) {
          collection[5 - rate]++;
          if (oldRate) collection[5 - oldRate]--;
          data.total.rating = _.sum(data.bookRatings);
          return rate;
     }

     function getTotal() {
          return data.total;
     }

     function getAverage() {
          return _.reduce(data.bookRatings, (sum, el, i) => {
               sum += (5 - i) * el;
               return sum;
          }, 0) / data.total.rating;
     }
}
