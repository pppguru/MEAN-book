import angular from 'angular';

export class FollowingController {
     alreadyFollowing:Boolean;
     follow:Function;
     unfollow:Function;
     Modal;
     messageService;
     me;
     type;
     /*@ngInject*/
     constructor(Modal, messageService, Auth) {
          'ngInject';
          this.Modal = Modal;
          this.messageService = messageService;
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.$onInit = () => {
               this.alreadyFollowing = _.findIndex(this.following, {_id: this.data._id}) >= 0;
          };
     }

     followUser(_id) {
          this.follow({_id, type: this.type});
          this.alreadyFollowing = true;
     }

     newMessage({user}) {
          this.Modal.newMessage({user}).then(({message}) => this.messageService.createMessage({receivers: [user._id], message}));
     }

     login() {
          this.Modal.login();
     }
}

export default angular.module('bookisApp.follow', [])
     .component('followPanel', {
          template: require('./follow-panel.html'),
          bindings: {
               data: '<',
               type: '@',
               follow: '&?',
               following: '<',
               unfollow: '&?',
               controls: '<'
          },
          controllerAs: 'vm',
          controller: FollowingController
     })
     .name;
