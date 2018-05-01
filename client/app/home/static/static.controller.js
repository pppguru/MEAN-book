'use strict';
// @flow

export default class StaticController {
     links = [{
          title: 'About',
          state: '.aboutus'
     }, {
          title: 'Contact',
          state: '.contact'
     }, {
          title: 'Mission',
          state: '.mission'
     }, {
          title: 'Team',
          state: '.team'
     }, {
          title: 'Press',
          state: '.press'
     }, {
          title: 'Careers',
          state: '.careers'
     }, {
          title: 'FAQ',
          state: '.faq'
     }, {
          title: 'Terms & Conditions',
          state: '.termsconditions'
     }];
     /*@ngInject*/
     constructor() {
     }
}
