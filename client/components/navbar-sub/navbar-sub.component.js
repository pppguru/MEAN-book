'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarSubComponent {
    algoliaService;
    hits;
    stats;
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
    isLoggedIn: Function;
    isMerchant: Function;
    getCurrentUser: Function;
    Modal;
    navigationService;
    userService;
    templateUrl;
    notificationsTemplateUrl;
    genres;
    state;
    constructor(Auth, algoliaService, Modal, userService, navigationService, genreService, $state, notificationService) {
        'ngInject';
        this.templateUrl = 'all-books.html';
        this.notificationsTemplateUrl = 'notifications.html';
        this.notifications = notificationService.getData('notifications');
        genreService.getGenres();
        this.genres = genreService.getData('genres');
        genreService.getMainGenres()
             .then(b => {
                  this.mainGenres = b;
                  console.log ('main genres : ', this.mainGenres);
             })
             .catch(err => console.log(err));

        this.hits = { books: [], users: [] };
        this.state = $state;
        this.stats = {};
        this.algoliaService = algoliaService;
        this.navigationService = navigationService;
        this.userService = userService;
        this.Modal = Modal;
        this.isLoggedIn = Auth.isLoggedInSync;
        this.isMerchant = Auth.isMerchantSync; //eslint-disable-line no-sync
        this.getCurrentUser = Auth.getCurrentUserSync; //eslint-disable-line no-sync
        this.myZoneMenu = navigationService.getMyZone(this.isMerchant());
    }

    redirectTo(sref, params) {
        this.state.go(sref, params);
        this.allBooksOpen = false;
        this.isOpen = false;
    }

    search(searchText) {
        this.isOpen = !!searchText;
        this.algoliaService.search('books', searchText, { hitsPerPage: 4 }).then(content => {
            this.hits.books.splice(0);
            this.hits.books.push(...content.books.hits);
            this.hits.users.splice(0);
            this.hits.users.push(...content.users.hits);
            _.extend(this.stats, _.pick(content.books, ['nbHits', 'processingTimeMS']));
        });
    }

    logout() {
        this.state.go('logout', { referrer: this.state.current.name, params: this.state.params });
    }

    toggled(isOpen) { //true or false
        console.log('IsOpen :', isOpen);
    }

    clear() {
        this.query = '';
        this.hits.users.splice(0);
        this.hits.books.splice(0);
    }

    stickyEvent({ event }) {
        this.navigationService.updateStickedState(event === 'stick');
    }

    sellBook() {
        this.Modal.sellBook().then(data => {
            const promise = this.getCurrentUser()._id ? Promise.resolve() : this.Modal.login();
            promise.then(() => this.Modal.handleMissingStripeSource({ type: 'payout', data }))
                .then(({ data, account }) => account && this.userService.createSale(data))
        })
    }
}

export default angular.module('directives.navbarsub', [])
    .component('navbarSub', {
        template: require('./navbar-sub.html'),
        controllerAs: 'vm',
        controller: NavbarSubComponent
    })
    .name;
