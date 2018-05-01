'use strict';
// @flow

export default class MyZoneController {
     Auth;
     me;
     isMerchant:Function;
     profilePercentage;
     size;
     resendVerificationEmail:Function;
     state;
     getLength = arrays => _.reduce(arrays, (agg, array) => agg + array.length, 0);
     /*@ngInject*/
     constructor(Auth, $mdSidenav, userService, navigationService, $state) {
          this.me = Auth.getCurrentUserSync();//eslint-disable-line no-sync
          this.Auth = Auth;
          this.state = $state;
          this.resendVerificationEmail = userService.resendVerificationEmail;
          this.isMerchant = Auth.isMerchantSync();//eslint-disable-line no-sync
          this.$mdSidenav = $mdSidenav;
          this.size = _.size;
          this.profilePercentage = missing => {
               if (missing) return _.omitBy(userService.getProfileProgress());
               const total = _.size(userService.getProfileProgress());
               const have = _.size(_.filter(userService.getProfileProgress()));
               return _.round(have / total * 100, 0);
          };
          this.navigationItems = navigationService.getMyZone(this.isMerchant);
     }

     logout() {
          this.state.go('logout', {referrer: this.state.current.name, params: this.state.params});
     }

     toggle() {
          this.$mdSidenav('left').toggle();
     }

     closeSidenav() {
          this.$mdSidenav('left').isOpen() && this.$mdSidenav('left').close();
     }

}
