'use strict';

export default function routes($stateProvider, $urlRouterProvider) {
     'ngInject';

     //default states
     $urlRouterProvider.when('/static', '/about-us');

     $stateProvider
          .state('static.aboutus', {
               url: '/about-us',
               template: require('./about-us/about-us.html'),
               authenticate: false
          })
          .state('static.careers', {
               url: '/careers',
               template: require('./careers/careers.html'),
               authenticate: false
          })
          .state('static.contact', {
               url: '/contact',
               template: require('./contact/contact.html'),
               authenticate: false
          })
          .state('static.faq', {
               url: '/faq',
               template: require('./faq/faq.html'),
               authenticate: false
          })
          .state('static.mission', {
               url: '/mission',
               template: require('./mission/mission.html'),
               authenticate: false
          })
          .state('static.press', {
               url: '/press',
               template: require('./press/press.html'),
               authenticate: false
          })
          .state('static.team', {
               url: '/team',
               template: require('./team/team.html'),
               authenticate: false
          })
          .state('static.termsconditions', {
               url: '/terms-conditions',
               template: require('./terms-conditions/terms-conditions.html'),
               authenticate: false
          });
}
