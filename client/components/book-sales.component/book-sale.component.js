import angular from 'angular';
import saleItems from './sale-items.component/sale-items.component';

export class BookSalesController {
     book;
     appConfig;
     format;
     index;
     me;
     Modal;
     requestService;
     saleService;
     bookService;
     userService;
     waitinglistService;
     /*@ngInject*/
     constructor(appConfig, Modal, requestService, Auth, saleService, bookService, userService, waitinglistService) {
          'ngInject';
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.appConfig = appConfig;
          this.saleService = saleService;
          this.Modal = Modal;
          this.requestService = requestService;
          this.bookService = bookService;
          this.userService = userService;
          this.waitinglistService = waitinglistService;

          this.newSales = [];

          this.$onInit = () => {
               this.groupedSales = _.reduce(appConfig.books.formats, (ag, el) => {
                    ag[el] = _.sortBy(_.reject(_.filter(this.book.sales, {format: el}), {condition : 'new'}), 'price');
                    return ag;
               }, {});

               saleService.getSaleWithBookID(this.book._id)
                    .then(b => {
                        this.newSales = b;
                    })
                    .catch(err => console.log(err));

               /* HARD CODE START */
               /*
               this.newSales = [{
                    book: this.book,
                    seller: {
                         businessName: 'Haugenbok',
                         imageUrl: '/assets/images/haugenbok.no.png',
                         address : {
                              coordinates : [
                                   10.7495727,
                                   59.9135131
                              ],
                              streetNumeric : '15',
                              streetAddress : 'Storgata',
                              city : 'Oslo',
                              state : 'Oslo',
                              country : 'Norway',
                              zip : '0155'
                         }
                    },
                    price: this.book.price.amount,
                    condition: 'new',
                    format: 'paperback'
               }];
               console.log('This.newSales :', this.newSales);
               console.log('this.groupedSales :', this.groupedSales);
               */
               /* HARD CODE END */
               if (this.override) {
                    this.format = _.get(_.find(this.book.sales, {_id: this.override}), 'format', this.book.format);
               } else {
                    this.format = _.get(this, 'book.sales[0].format', this.book.format);
               }
               this.index = _.findIndex(this.groupedSales[this.format], {_id: this.override});
               this.index = this.index === -1 ? 0 : this.index;
          };
     }
     formatChanged({type, value}) {
          this.index = 0;
          this.bookService.getISBN({book: this.book, format: value}).then(({isbn}) => {
               if (isbn) _.extend(this.book.isbn, isbn);
          })
     }
     requestBook({sale}) {
          let data;
          sale = sale || this.groupedSales[this.format][this.index];
          this.Modal.requestBook({sale: _.extend(sale, {book: this.book}), showUserPartial: true})
               .then(({delivery, message, price, displayedPrice}) => {
                    data = {
                         sale: sale._id,
                         seller: sale.seller._id,
                         delivery, message, price, displayedPrice
                    };
                    return !!this.me()._id ? Promise.resolve() : this.Modal.login();
               })
               .then(() => Promise[this.me()._id === data.seller ? 'reject' : 'resolve']('Its your book'))
               .then(() => this.Modal.handleMissingStripeSource({type: 'payment', data}))
               .then(({data, account}) => account && this.requestService.createRequest(data))
               .then(() => {
                    const index = _.findIndex(this.book.sales, {_id: sale._id});
                    this.book.sales.splice(index, 1);
                    this.groupedSales[this.format].splice(this.index, 1);
                    this.index = 0;
               })
               .catch(err => console.log(err))
     }
     sellBook() {
          this.Modal.sellBook(_.extend({book: this.book}, {format: this.format}))
               .then(data => {
                    const promise = this.me()._id ? Promise.resolve() : this.Modal.login();
                    promise.then(() => this.Modal.handleMissingStripeSource({type: 'payout', data}))
                         .then(({data, account}) => account && this.saleService.createSale(data))
                         .then(s => {
                              if (!s) return;
                              s.seller = this.me();
                              this.format = s.format;
                              const index = _.sortedIndexBy(this.groupedSales[this.format], s, 'price');
                              this.groupedSales[this.format].splice(index, 0, s);
                              this.book.sales.push(s);
                         })
                         .catch(err => console.log('err', err));
               })
     }
     addToWaitinglist() {
          const wasLoggedIn = !!this.me()._id;
          const promise = wasLoggedIn ? Promise.resolve() : this.Modal.login();
          promise.then(() => wasLoggedIn ? Promise.resolve() : this.userService.getUserWaitinglist({book: this.book}))
               .then(wl => Promise[wl && wl.length ? 'reject' : 'resolve'](wl))
               .then(() => this.waitinglistService.createWaitinglist(this.book))
               .then(wl => this.alreadyWaitinglisted.push(wl))
               .catch(wl => this.alreadyWaitinglisted.push(wl));
     }
}

export default angular.module('bookisApp.booksales', [saleItems])
     .component('bookSales', {
          template: require('./book-sale.html'),
          bindings: {
               book: '<',
               override: '<',
               alreadyWaitinglisted: '='
          },
          controllerAs: 'bs',
          controller: BookSalesController
     })
     .name;
