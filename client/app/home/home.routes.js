'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('allbooks', {
               url: '/all-books',
               abstract: true,
               template: require('./all-books/all-books.html'),
               // controller: 'AllBooksController',
               // controllerAs: 'vm',
               // authenticate: false
          })
          .state('kids', {
               url: '/kids',
               template: require('./kids/kids.html'),
               controller: 'KidsController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('near', {
               url: '/near',
               template: require('./near/near.html'),
               controller: 'NearController',
               controllerAs: 'vm',
               resolve: {me},
               authenticate: false
          })
          .state('student', {
               url: '/student',
               template: require('./student/student.html'),
               controller: 'StudentController',
               resolve: {
                    me: Auth => Auth.getCurrentUser(me => me),
                    wish: (userService, me) => userService.getUserWishList(me)
               },
               controllerAs: 'vm',
               authenticate: false
          })
          .state('top100', {
               url: '/top100',
               template: require('./top100/top100.html'),
               resolve: {
                    me: Auth => Auth.getCurrentUser(me => me),
                    reads: (userService, me) => userService.getUserBookshelf(me),
                    wish: (userService, me) => userService.getUserWishList(me)
               },
               controller: 'Top100Controller',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('community', {
               url: '/community',
               template: require('./community/community.html'),
               controller: 'CommunityController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('sellbooks', {
               url: '/sell-books',
               template: require('./sell-books/sell-books.html'),
               controller: 'SellBooksController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('advanced', {
               url: '/advanced',
               params: {
                    query: undefined,
                    age: undefined,
                    year: undefined,
                    genres: undefined
               },
               template: require('./advanced/advanced.html'),
               controller: 'AdvancedController',
               controllerAs: 'vm',
               authenticate: false
          })
          .state('static', {
               template: require('./static/static.html'),
               controller: 'StaticController',
               controllerAs: 'vm'
          })
          .state('proto', {
               template: require('./proto/proto.html'),
               controller: 'ProtoController',
               controllerAs: 'vm'
          });
}
const me = Auth => Auth.getCurrentUser(me => me);//eslint-disable-line no-shadow
