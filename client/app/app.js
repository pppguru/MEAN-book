'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
import ngValidationMatch from 'angular-validation-match';
import ngMaterial from 'angular-material';
import 'bootstrap';
import 'moment';
import 'angular-moment';
import 'ng-file-upload';
import 'angular-simple-logger';
import 'angular-google-maps';
require('imports?this=>window,exports=>false,define=>false!ui-cropper');
import 'angular-socialshare';

import 'angular-chart.js';
import 'angular-elastic';
import 'angularjs-slider';
/* translate */
import 'angular-translate';
import 'angular-dynamic-locale';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';
import 'angular-translate-handler-log';
import 'angular-translate-loader-static-files';

import {
     routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import home from './home';
import account from './account';
import navbar from '../components/navbar/navbar.component';
import algolia from '../components/algolia';
import navbarSub from '../components/navbar-sub/navbar-sub.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import toast from '../components/toast';
import googleAutocomplete from '../components/address-autocomplete';
import Modal from '../components/modal/modal.service';
import directives from '../components/directives';
import translate from '../components/translate';
import filters from '../components/filters';
import bp from '../components/book-panel.component/book-panel.component';
import bh from '../components/book-hit.component/book-hit.component';
import user from '../components/resources-services/user';
import author from '../components/resources-services/author';
import notification from '../components/resources-services/notification';
import messages from '../components/resources-services/message';
import conversations from '../components/resources-services/conversation';
import book from '../components/resources-services/book';
import genre from '../components/resources-services/genres';
import navigation from '../components/resources-services/navigation';
import sale from '../components/resources-services/sale';
import request from '../components/resources-services/request';
import bookRating from '../components/resources-services/book-ratings';
import bookSales from '../components/book-sales.component/book-sale.component';
import bookisSlider from '../components/bookis-slider.component/bookis-slider.component';
import bookisFilter from '../components/bookis-filter-sidebar/bookis-filter-sidebar.component';
import select from '../components/bookis-select/bookis-select.component';
import birthday from '../components/bookis-birthday/bookis-birthday.component';
import slick from '../components/bookis-slick';
import rating from '../components/bookis-rating/bookis-rating.component';
import bookisChart from '../components/bookis-chart/bookis-chart.component';
import bookReview from '../components/resources-services/book-reviews';
import bookReply from '../components/resources-services/book-replies';
import wishlist from '../components/resources-services/wishlist';
import waitinglist from '../components/resources-services/waitinglist';
import bookshelf from '../components/resources-services/bookshelf';
import userProfile from '../components/bookis-user-profile/bookis-user-profile.component';
import authorProfile from '../components/bookis-author-profile/bookis-author-profile.component';
import chart from '../components/chart';
import sticky from '../components/sticky';
import templates from '../components/templates';
import '../components/chart/border.radius';
import './app.scss';
import '../touch';

angular.module('bookisApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, _Auth, home, user, 'uiCropper', 'ngFileUpload', 'nemLogging', 'uiGmapgoogle-maps',
     account, navbar, footer, main, constants, util, Modal, directives, bp, bh, ngValidationMatch, ngMaterial, book, toast, googleAutocomplete, select, birthday, request,
     'angularMoment', navbarSub, slick, rating, bookRating, 'chart.js', chart, bookReview, bookReply, '720kb.socialshare', templates, wishlist, bookisChart, bookshelf,
     'monospaced.elastic', userProfile, filters, sale, algolia, 'rzModule', bookSales, bookisSlider, bookisFilter, genre, translate, conversations, messages, sticky, navigation,
     notification, authorProfile, author, waitinglist])
     .config(routeConfig)
     .config((uiGmapGoogleMapApiProvider, $mdThemingProvider) => {
          'ngInject';
          uiGmapGoogleMapApiProvider.configure({
               key: 'AIzaSyA-B0gD8c5MYPxyT3ElHwnGxMPvhpRwnNc',
               v: '3.27',
               libraries: 'weather,geometry,places,visualization'
          });
          $mdThemingProvider.theme('success-toast');
          $mdThemingProvider.theme('error-toast');
          $mdThemingProvider.theme('default')
               .primaryPalette('deep-orange', {});
     })
     // .constant('moment', require('moment-timezone'))
     .run(($rootScope, $location, Auth, $anchorScroll, $window) => {
          'ngInject';
          // Redirect to login if route requires auth and you're not logged in

          $rootScope.$on('$stateChangeStart', (event, next) => {
               Auth.isLoggedIn(loggedIn => {
                    if (next.authenticate && !loggedIn) {
                         $location.path('/login');
                    }
               });
          });
          const wrap = (method) => {
               const orig = $window.window.history[method];
               $window.window.history[method] = function() {
                    const returnValue = orig.apply(this, Array.prototype.slice.call(arguments));
                    $anchorScroll();
                    return returnValue;
               };
          };
          wrap('pushState');
          wrap('replaceState');
     })
     .controller('LockController', LockController);

function LockController($http, $location) {
     'ngInject';
     this.unlocked = $location.$$host === 'localhost';
    //  this.unlocked = true;
     if (this.unlocked) return;
     const pass = prompt('Enter bookis root password:');
     $http.post('/auth/local/unlock', {pass})
          .then(() => {
               this.unlocked = true;
          })
          .catch(() => {
               this.unlocked = false;
          })
}

angular.element(document)
     .ready(() => {
          angular.bootstrap(document, ['bookisApp'], {
               strictDi: true
          });
     });
