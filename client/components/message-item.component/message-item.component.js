import angular from 'angular';

export class MessageItemController {
     Auth;
     me;
     /*@ngInject*/
     constructor(Auth) {
          'ngInject';
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     }
}

export default angular.module('bookisApp.messageitem', [])
     .component('messageItem', {
          template: require('./message-item.html'),
          bindings: {
               user: '<',
               message: '<',
               stamp: '<',
               type: '<'
          },
          controllerAs: 'mi',
          controller: MessageItemController
     })
     .name;
