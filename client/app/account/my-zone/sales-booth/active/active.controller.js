'use strict';
// @flow

export default class ActiveController {
     sales;
     userService;
     Modal;
     bookRatingService;
     bookReviewService;
     bookService;
     me;
     state;
     /*@ngInject*/
     constructor(Modal, userService, bookRatingService, me, bookReviewService, bookService, $state) {
          this.Modal = Modal;
          this.userService = userService;
          this.bookRatingService = bookRatingService;
          this.bookReviewService = bookReviewService;
          this.bookService = bookService;
          this.me = me;
          this.state = $state;
          this.sales = userService.getData('sales', 'availableAndRequested');
     }

     newSale() {
          this.Modal.sellBook()
               .then(data => this.Modal.handleMissingStripeSource({type: 'payout', data}))
               .then(({data, account}) => account && this.userService.createSale(data))
               .catch(err => console.log('err', err));
     }

     bulkSell() {
          this.Modal.bulkSellBooks().then(() => this.state.reload()).catch(() => this.state.reload());
     }

     editSale(sale) {
          this.Modal.editSale(sale)
               .then(s => this.userService.editSale(s))
               .catch(err => console.log('err', err));
     }

     remove(sale) {
          this.Modal.confirm('Delete', sale.book.title)
               .then(() => this.userService.removeSale(sale))
               .catch(err => console.log('err', err));
     }

     rateBook(sale) {
          this.Modal.rateBook({book: sale.book})
               .then(({rate, review}) => {
                    if (review) this.bookReviewService.createReview({review}, sale.book);
                    return this.bookRatingService.createRating(sale.book, rate);
               })
               .then(rate => this.userService.updateBookRating(sale.book, rate))
               .catch(err => console.log('err', err));
     }
}
