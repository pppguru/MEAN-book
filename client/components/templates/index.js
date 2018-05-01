'use strict';

import angular from 'angular';

export default angular.module('bookisApp.templates', [])
     .run(['$templateCache', $templateCache => {
          $templateCache.put('profile.html', require('../../app/account/my-zone/profile.html'));
          $templateCache.put('all-books.html', require('../navbar-sub/all-books.html'));
          $templateCache.put('notifications.html', require('../navbar-sub/notifications.html'));
          $templateCache.put('login.html', require('../modal/templates/login/login.html'));
          $templateCache.put('crop.html', require('../modal/templates/crop/crop.html'));
          $templateCache.put('take.image.html', require('../modal/templates/take-image/take.image.html'));
          $templateCache.put('reject.html', require('../modal/templates/reject-with-reason/reject.html'));
          $templateCache.put('edit.book.html', require('../modal/templates/edit-book/edit.book.html'));
          $templateCache.put('rate.book.html', require('../modal/templates/rate-book/rate.book.html'));
          $templateCache.put('request.book.html', require('../modal/templates/request-book/request.book.html'));
          $templateCache.put('sell.book.html', require('../modal/templates/sell-book/sell.book.html'));
          $templateCache.put('bulk.sell.books.html', require('../modal/templates/bulk-sell-books/bulk.sell.books.html'));
          $templateCache.put('signup.html', require('../modal/templates/signup/signup.html'));
          $templateCache.put('signup.merchant.html', require('../modal/templates/signup.merchant/signup.merchant.html'));
          $templateCache.put('auth.html', require('../modal/templates/auth/auth.html'));
          $templateCache.put('fast.buy.html', require('../modal/templates/fast-buy/fast.buy.html'));
          $templateCache.put('new.message.html', require('../modal/templates/new-message/new.message.html'));
          $templateCache.put('details.html', require('../modal/templates/details/details.html'));
          $templateCache.put('payment.method.html', require('../modal/templates/payment-method/payment.method.html'));
          $templateCache.put('payout.method.html', require('../modal/templates/payout-method/payout.method.html'));
          $templateCache.put('confirm.html', require('../modal/templates/confirm.html'));
          $templateCache.put('mandatory.html', require('../modal/templates/add-mandatory-stripe/mandatory.stripe.html'));
          $templateCache.put('_activity.html', require('../../components/bookis-user-profile/_activity.html'));
          $templateCache.put('_followers.html', require('../../components/bookis-user-profile/_followers.html'));
          $templateCache.put('_following.html', require('../../components/bookis-user-profile/_following.html'));
          $templateCache.put('_have.read.html', require('../../components/bookis-user-profile/_have.read.html'));
          $templateCache.put('_shipping.return.html', require('../../components/bookis-user-profile/_shipping.return.html'));
          $templateCache.put('_books.for.sale.html', require('../../components/bookis-user-profile/_books.for.sale.html'));
          $templateCache.put('_wishlist.html', require('../../components/bookis-user-profile/_wishlist.html'));
          $templateCache.put('_works.html', require('../../components/bookis-author-profile/_works.html'));
          $templateCache.put('_discussion.html', require('../../components/bookis-author-profile/_discussion.html'));
          $templateCache.put('_author_followers.html', require('../../components/bookis-author-profile/_author_followers.html'));
          $templateCache.put('_user.html', require('../../app/account/my-zone/settings/my-account/_user.html'));
          $templateCache.put('_merchant.html', require('../../app/account/my-zone/settings/my-account/_merchant.html'));
          $templateCache.put('following', require('../../app/account/my-zone/dashboard-notifications/templates/following.html'));
          $templateCache.put('conversation', require('../../app/account/my-zone/dashboard-notifications/templates/conversation.html'));
          $templateCache.put('wishlist', require('../../app/account/my-zone/dashboard-notifications/templates/wishlist.html'));
          $templateCache.put('review', require('../../app/account/my-zone/dashboard-notifications/templates/review.html'));
          $templateCache.put('reply', require('../../app/account/my-zone/dashboard-notifications/templates/reply.html'));
          $templateCache.put('bought', require('../../app/account/my-zone/dashboard-notifications/templates/bought.html'));
          $templateCache.put('user-map-card.html', require('../../app/home/near/user-map-card.html'));
     }])
     .name;
