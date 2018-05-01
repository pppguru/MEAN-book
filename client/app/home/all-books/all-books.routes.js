'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     $urlRouterProvider.when('/all-books', '/all-books/popular');

     $stateProvider
          .state('allbooks.details', {
               url: '/:id/details',
               params: {
                    sale: undefined
               },
               template: require('./book-details/book-details.html'),
               controller: 'BookDetailsController',
               controllerAs: 'vm',
               resolve: {book},
               authenticate: false
          })
          .state('allbooks.popular', {
               url: '/popular',
               template: require('./popular/popular.html'),
               controller: 'PopularController',
               controllerAs: 'vm',
               authenticate: false
          });
}

const book = (bookService, $stateParams) => bookService.getBook($stateParams.id);
