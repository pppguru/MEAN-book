import angular from 'angular';

export class FooterComponent {
     links = [{
          title: 'About',
          state: 'static.aboutus'
     }, {
          title: 'Contact',
          state: 'static.contact'
     }, {
          title: 'Mission',
          state: 'static.mission'
     }, {
          title: 'Team',
          state: 'static.team'
     }, {
          title: 'Press',
          state: 'static.press'
     }, {
          title: 'Careers',
          state: 'static.careers'
     }, {
          title: 'FAQ',
          state: 'static.faq'
     }, {
          title: 'Terms & Conditions',
          state: 'static.termsconditions'
     }];
     /*@ngInject*/
     constructor() {
          'ngInject';
     }
}

export default angular.module('directives.footer', [])
     .component('footer', {
          template: require('./footer.html'),
          controllerAs: 'fo',
          controller: FooterComponent
     })
     .name;
