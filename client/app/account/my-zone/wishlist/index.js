'use strict';

import angular from 'angular';
import WishlistController from './wishlist.controller';

export default angular.module('bookisApp.wishlist', [])
     .controller('WishlistController', WishlistController)
     .name;
