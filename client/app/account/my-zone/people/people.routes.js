'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     // default states
     $urlRouterProvider.when('/my-zone/people', '/my-zone/people/following');

     $stateProvider
          .state('myzone.people.followers', {
               url: '/followers',
               template: require('./followers/followers.html'),
               controller: 'FollowersController',
               controllerAs: 'vm',
               authenticate: true
          })
          .state('myzone.people.following', {
               url: '/following',
               template: require('./following/following.html'),
               controller: 'FollowingController',
               controllerAs: 'vm',
               authenticate: true
          });
}
