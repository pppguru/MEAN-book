'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider
          .state('community.user', {
               url: '/user/:id/profile',
               template: require('./user/user.profile.html'),
               controller: 'UserProfileController',
               controllerAs: 'vm',
               resolve: {user},
               authenticate: false
          })
          .state('community.author', {
               url: '/author/:id/profile',
               template: require('./author/author.profile.html'),
               controller: 'AuthorProfileController',
               controllerAs: 'vm',
               resolve: {author},
               authenticate: false
          });
}

const user = (userService, $stateParams) => userService.getUser($stateParams.id);
const author = (authorService, $stateParams) => authorService.getAuthor($stateParams.id);
