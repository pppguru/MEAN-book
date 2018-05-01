'use strict';
// @flow

export default class PopularController {
     books;
     genres;
     requestService;
     Auth;
     Modal;
     me;
     breakpoints = [
          {
               breakpoint: 1200,
               settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
               }
          },
          {
               breakpoint: 1000,
               settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
               }
          },
          {
               breakpoint: 800,
               settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
               }
          },
          {
               breakpoint: 600,
               settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
               }
          }
     ];
     slickConfig = {
          infinite: true,
          draggable: true,
          slidesToShow: 5,
          slidesToScroll: 5,
          initialSlide: 0,
          event: {
               // breakpoint(e, c, b) {
               // },
               // afterChange(event, slick, currentSlide, nextSlide) {
               // },
               // edge(event, slick, direction) {
               // },
               // init(event, slick) {
               // }
          }
     };
     /*@ngInject*/
     constructor($http, bookService, requestService, Auth, Modal) {
          this.requestService = requestService;
          this.Auth = Auth;
          this.Modal = Modal;
          this.me = this.Auth.getCurrentUserSync;//eslint-disable-line no-sync
          bookService.getBooks()
               .then(books => {
                    this.books = books;
               });
          $http({url: 'api/genres', method: 'GET'}).then(xhr => {
               this.genres = xhr.data;
          });
     }

     requestBook({book, book: {sales: [sale]}}) {
          sale.book = book;
          let data;
          this.Modal.requestBook({sale, showUserPartial: true})
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
               .then(() => _.remove(book.sales, {_id: sale._id}))
               .catch(err => console.log(err))
     }
}
