'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('allbooks.details.seller', {
               url: '/:uid/seller',
               template: require('./seller/book.seller.html'),
               controller: 'BookSellerController',
               controllerAs: 'se',
               resolve: {user},
               authenticate: false
          })
          .state('allbooks.details.author', {
               url: '/:aid/author',
               template: require('./author/book.author.html'),
               controller: 'BookAuthorController',
               resolve: {author},
               controllerAs: 'au',
               authenticate: false
          })
          .state('allbooks.details.sellers', {
               url: '/sellers',
               template: require('./sellers/book.sellers.html'),
               controller: 'BookSellersController',
               controllerAs: 'ses',
               authenticate: false
          });
          // .state('allbooks.details.author', {
          //      url: '/:id/author',
          //      template: require('./popular/popular.html'),
          //      controller: 'PopularController',
          //      controllerAs: 'vm',
          //      authenticate: false
          // })
}

const user = (userService, $stateParams) => userService.getUser($stateParams.uid);
const author = (authorService, $stateParams) => authorService.getAuthor($stateParams.aid);
