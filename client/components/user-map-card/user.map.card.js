import angular from 'angular';

export class UserMapCard {
     /*@ngInject*/
     constructor($interval) {
          'ngInject';
          const vm = this;

          let animation;
          vm.enter = enter;
          vm.leave = leave;
          const animationEnabled = () => vm.pinned !== vm.user._id;
          const playAnimation = () => vm.marker.options.animation = google.maps.Animation.BOUNCE;
          const stopAnimation = () => vm.marker.options.animation = google.maps.Animation.So;
          
          function enter() {
               if (animationEnabled()) {
                    playAnimation();
                    animation = $interval(playAnimation, 800);
               }
          }

          function leave() {
               if (animationEnabled()) {
                    stopAnimation();
                    $interval.cancel(animation);
               }
          }
     }
}

export default angular.module('bookisApp.UserMapCard', [])
     .component('userMapCard', {
          template: require('./user.map.card.html'),
          bindings: {
               user: '<',
               pinned: '<',
               marker: '<'
          },
          controllerAs: 'mc',
          controller: UserMapCard
     })
     .name;
