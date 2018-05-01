'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
     menu = [{
          title: 'Student',
          state: 'student'
     }, {
          title: 'Kids',
          state: 'kids'
     }, {
          title: 'Top 100',
          state: 'top100'
     }, {
          title: 'Near',
          state: 'near'
     }];
     isLoggedIn:Function;
     isMerchant:Function;
     getCurrentUser:Function;
     Modal:Function;
     isCollapsed = true;
     openLogin:Function;
     isSticked;
     isOpened = false;
     userService;
     templateUrl;
     genres;
     state;
     notificationsTemplateUrl;
     constructor(Auth, Modal, $state, userService, navigationService, genreService, notificationService) {
          'ngInject';
          this.notificationsTemplateUrl = 'notifications.html';
          this.notifications = notificationService.getData('notifications');
          this.templateUrl = 'all-books.html';
          genreService.getGenres();
          this.genres = genreService.getData('genres');
          this.state = $state;
          this.Modal = Modal;
          this.userService = userService;
          this.redirect = $state.go;
          this.query = '';
          this.hits = [];
          this.stats = {};
          this.isLoggedIn = Auth.isLoggedInSync;
          this.isMerchant = Auth.isMerchantSync;//eslint-disable-line no-sync
          this.getCurrentUser = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.openLogin = Modal.login;
          this.isSticked = navigationService.getStickedState;
          this.myZoneMenu = navigationService.getMyZone(this.isMerchant());
     }

     redirectTo({sref, params}) {
          this.state.go(sref, params);
          this.allBooksOpen = false;
     }

     sellBook() {
          this.Modal.sellBook().then(data => {
               const promise = this.getCurrentUser()._id ? Promise.resolve() : this.Modal.login();
               promise.then(() => this.Modal.handleMissingStripeSource({type: 'payout', data}))
                    .then(({data, account}) => account && this.userService.createSale(data))
          })
     }
     
     logout() {
          this.state.go('logout', {referrer: this.state.current.name, params: this.state.params});
     }

     toggle(open) {
          this.isOpened = open;
     }

     toggleMenu(e){
        console.log('mobile nav', this.mobilenav);

        console.log('body style', this.$rootScope);

        if (this.mobilenav) {

        }
        else {

        }


     }
}

export default angular.module('directives.navbar', [])
     .component('navbar', {
          template: require('./navbar.html'),
          controller: NavbarComponent,
          controllerAs: 'vm',
     })
     .name;
