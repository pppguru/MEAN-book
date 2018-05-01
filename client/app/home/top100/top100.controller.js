'use strict';
// @flow

export default class Top100Controller {
     algoliaService;
     wishlistService;
     userService;
     Modal;
     genres;
     hits = [];
     reads;
     hideRead;
     filterGenre;
     readCount;
     Auth;
     me;
     login:Function;
     bookReviewService;
     bookRatingService;
     /*@ngInject*/
     constructor(Auth, algoliaService, genreService, userService, wishlistService, Modal, bookReviewService, bookRatingService) {
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.algoliaService = algoliaService;
          this.wishlistService = wishlistService;
          this.userService = userService;
          this.bookReviewService = bookReviewService;
          this.bookRatingService = bookRatingService;
          this.Modal = Modal;
          this.login = Modal.login;
          genreService.getGenres();
          this.hideRead = false;
          this.reads = userService.getBookShelf('read');
          this.shelf = userService.getBookShelf('all');
          this.wishlist = userService.getWishList('all');
          this.genres = genreService.getData('genres');
          algoliaService.top100({genre: this.filterGenre}).then(data => bindData(this, data));
     }

     addToWishList({hit}) {
          this.wishlistService.createWishList({_id: hit.objectID, title: hit.title})
               .then(() => {
                    hit.wish = true;
               });
     }

     sellBook({hit}) {
          this.Modal.sellBook({book: {isbn: {full: hit.isbn_full}}})
               .then(data => this.Modal.handleMissingStripeSource({type: 'payout', data}))
               .then(({data, account}) => account && this.userService.createSale(data))
               .then(sale => hit.shelf = !sale) //eslint-disable-line no-return-assign
               .catch(err => console.log('err', err));
     }

     addFilter({genre}) {
          this.filterGenre = genre && this.filterGenre === genre ? undefined : genre ? genre : this.filterGenre;
          this.algoliaService.top100({genre: this.filterGenre}).then(data => bindData(this, data));
     }

     rateBook({hit}) {
          const book = {
               _id: hit.objectID,
               title: hit.title,
               author: hit.author.length ? [{
                    _id: hit.author._id,
                    firstName: hit.author[0].displayName.split(' ')[0],
                    lastName: hit.author[0].displayName.split(' ')[1]
               }] : [],
               image: {
                    full: hit.image
               }
          };
          const promise = this.me()._id ? Promise.resolve() : this.Modal.login();
          promise.then(() => {
               this.Modal.rateBook({book})
                    .then(({rate, review}) => {
                         if (review) this.bookReviewService.createReview({review}, book);
                         return this.bookRatingService.createRating(book, rate);
                    })
                    .then(rate => {
                         hit.rate = rate;
                    })
                    .catch(err => console.log('err', err));
          });
     }
}

function bindData(context, data) {
     context.hits.splice(0);
     context.hits = data.hits;
     context.readsIds = _.map(context.reads, 'book._id');
     context.wishIds = _.map(context.wishlist, 'book._id');
     context.shelfIds = _.map(context.shelf, 'book._id');
     _.each(context.hits, hit => {
          hit.read = _.includes(context.readsIds, hit.objectID);
          hit.wish = _.includes(context.wishIds, hit.objectID);
          hit.shelf = _.includes(context.shelfIds, hit.objectID);
     });
     context.readCount = _.size(_.filter(context.hits, 'read'));
}
