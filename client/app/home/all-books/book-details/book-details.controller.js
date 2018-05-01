'use strict';
// @flow

export default class BookDetailsController {
     book;
     index;
     myRate;
     ratings;
     total;
     average;
     bookRatingService;
     bookReviewService;
     bookReplyService;
     wishlistService;
     userService;
     saleService;
     currentTime;
     round:Function;
     me;
     Modal;
     requestService;
     alreadyWishListed;
     bookshelfService;
     waitinglistService;
     reviews;
     timeout;
     appConfig;
     social;
     format;
     state;
     includes = _.includes;
     range = n => new Array(n);
     /*@ngInject*/
     constructor(book, bookRatingService, wishlistService, bookReviewService, bookReplyService, bookService, bookshelfService,
                 Auth, Modal, requestService, waitinglistService, $timeout, appConfig, userService, saleService, $stateParams, $state) {
          bookService.getSuggested({book});
          this.override = $stateParams.sale;
          this.suggested = bookService.getData('suggested');
          this.currentTime = new Date();
          this.timeout = $timeout;
          this.state = $state;
          this.appConfig = appConfig;
          this.book = book;
          this.round = _.round;
          this.bookRatingService = bookRatingService;
          this.bookReviewService = bookReviewService;
          this.waitinglistService = waitinglistService;
          this.bookReplyService = bookReplyService;
          this.requestService = requestService;
          this.wishlistService = wishlistService;
          this.bookshelfService = bookshelfService;
          this.userService = userService;
          this.saleService = saleService;
          this.Modal = Modal;
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          bookRatingService.getMyRating(this.book);
          this.myRate = bookRatingService.getData('myRate');
          this.average = bookRatingService.getAverage;
          userService.getUserWishList(undefined, book)
               .then(wl => {
                    this.alreadyWishListed = wl;
               });
          userService.getUserWaitinglist({book})
               .then(wl => {
                    this.alreadyWaitinglisted = wl;
               });
          this.userService.getUserBookshelf(this.me(), book)
               .then(bs => {
                    this.alreadyRead = bs;
               });
          bookRatingService.getRatingsAggregation(book._id);
          this.ratings = bookRatingService.getData('bookRatings');
          this.total = bookRatingService.getTotal();
          this.social = _.initial(appConfig.social);
          this.repliesPerFetch = appConfig.repliesPerFetch;
          this.reviewsPerFetch = appConfig.reviewsPerFetch;
          this.reviews = bookReviewService.getData('reviews');
          bookReviewService.getBookReviews({book, skip: 0}).then(rev => {
               if (_.isEmpty(this.reviews)) return;
               bookReviewService.getReviewReplies(book, this.reviews[0]);//most replies
               _.each(this.reviews, (e, i) => {
                    e.amFilter = (new Date().getTime() - new Date(e.createdAt).getTime()) / 1000 / 60 / 60 < 24;
                    e.collapsed = i !== 0;
               });
          });
     }

     sellBook() {
          this.Modal.sellBook({book: this.book})
               .then(data => {
                    const promise = this.me()._id ? Promise.resolve() : this.Modal.login();
                    promise.then(() => this.Modal.handleMissingStripeSource({type: 'payout', data}))
                         .then(({data, account}) => account && this.userService.createSale(data))
                         .then(s => this.state.go(this.state.current, {sale: s._id}, {reload: true}))
                         .catch(err => console.log('err', err));
               })
     }
     
     markAsRead() {
          const wasLoggedIn = !!this.me()._id;
          const promise = wasLoggedIn ? Promise.resolve() : this.Modal.login();
          promise.then(() => wasLoggedIn ? Promise.resolve() : this.userService.getUserBookshelf(this.me(), this.book))
               .then(bs => Promise[bs && bs.length ? 'reject' : 'resolve'](bs))
               .then(() => this.bookshelfService.createBookshelf(this.book, true))
               .then(bs => this.alreadyRead.push(bs))
               .catch(bs => this.alreadyRead.push(bs));
     }

     updateRating({rating}) {
          let oldRate, method, args, upArgs;
          const wasLoggedIn = !!this.me()._id;
          const promise = wasLoggedIn ? Promise.resolve() : this.Modal.login();
          promise
               .then(() => wasLoggedIn ? Promise.resolve() : this.bookRatingService.getMyRating(this.book))
               .then(() => {
                    oldRate = _.clone(_.get(this, 'myRate[0].rate'));
                    method = oldRate ? 'updateRating' : 'createRating';
                    args = oldRate ? [this.myRate, rating] : [this.book, rating];
                    return this.bookRatingService[method](...args)
               })
               .then(r => this.bookRatingService.syncRates(...(oldRate ? [r, oldRate] : [r])))
               .then(r => {
                    const index = _.findIndex(this.reviews, e => e.user._id === this.me()._id);
                    if (index === -1) return;
                    this.reviews[index].user.userRating = r;
               });
     }

     login() {
          this.Modal.login();
     }

     reviewBook(review) {
          const wasLoggedIn = !!this.me()._id;
          const promise = wasLoggedIn ? Promise.resolve() : this.Modal.login();
          promise.then(() => wasLoggedIn ? Promise.resolve() : Promise[this.notReviewed() ? 'resolve' : 'reject']('Already reviewed book'))
               .then(() => this.bookReviewService.createReview({review}, this.book, this.myRate))
               .then(() => {
                    this.review = '';
               })
               .catch(err => console.log('rev err', err))
     }

     showReplyPartial(id, i) {
          _.each(this.reviews, el => {
               el.showReply = el._id.toString() === id.toString();
          });
          this.timeout(() => $(`#reply${i}`).focus(), 200);
     }

     cancelReply(review) {
          this.reply = '';
          review.showReply = false;
     }

     createReply(review) {
          const promise = !!this.me()._id ? Promise.resolve() : this.Modal.login();
          promise.then(() => this.bookReviewService.replyToReview(this.book, review, this.reply))
               .then(() => {
                    review.collapsed = false;
                    this.cancelReply(review);
               });

     }

     getReplies(review) {
          this.bookReviewService.getReviewReplies(this.book, review);
     }

     getReviews() {
          this.bookReviewService.getBookReviews({book: this.book});
     }

     expanding(review) {
          if (!review.fetched && review.noReplies) {
               this.bookReviewService.getReviewReplies(this.book, review);
          }
     }

     collapsing(review) {
          review.cached = _.cloneDeep(review.replies);
          review.replies.splice(this.repliesPerFetch, review.replies.length);
          review.fetched = review.replies.length;
     }

     toggleReviewLike(review) {
          const promise = !!this.me()._id ? Promise.resolve() : this.Modal.login();
          promise.then(() => this.bookReviewService.toggleReviewLike(this.book, review));
     }

     toggleReviewFlag(review) {
          const promise = !!this.me()._id ? Promise.resolve() : this.Modal.login();
          promise.then(() => this.bookReviewService.toggleReviewFlag(this.book, review));
     }

     toggleReplyLike(review, reply) {
          const promise = !!this.me()._id ? Promise.resolve() : this.Modal.login();
          promise.then(() => this.bookReplyService.toggleReplyLike(this.book, review, reply));
     }

     toggleReplyFlag(review, reply) {
          const promise = !!this.me()._id ? Promise.resolve() : this.Modal.login();
          promise.then(() => this.bookReplyService.toggleReplyFlag(this.book, review, reply));
     }

     shareUrl() {
          return `${this.appConfig.envData.DOMAIN}/all-books/${this.book._id}/details`;
     }

     addToWishList() {
          const wasLoggedIn = !!this.me()._id;
          const promise = wasLoggedIn ? Promise.resolve() : this.Modal.login();
          promise.then(() => wasLoggedIn ? Promise.resolve() : this.userService.getUserWishList(this.me(), this.book))
               .then(wl => Promise[wl && wl.length ? 'reject' : 'resolve'](wl))
               .then(() => this.wishlistService.createWishList(this.book))
               .then(wl => this.alreadyWishListed.push(wl))
               .catch(wl => this.alreadyWishListed.push(wl));
     }

     notReviewed() {
          return this.me()._id ? !_.includes(_.map(this.reviews, 'user._id'), this.me()._id.toString()) : true;
     }

}
