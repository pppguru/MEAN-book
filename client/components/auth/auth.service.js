'use strict';
// @flow

class _User {
     _id:string = '';
     name:string = '';
     email:string = '';
     role:string = '';
     $promise = undefined;
}

export function AuthService($location, $http, $cookies, $q, appConfig, Util, UserAPI, notificationService) {
     'ngInject';

     var safeCb = Util.safeCb;
     var currentUser:_User = new _User();
     var userRoles = appConfig.userRoles || [];
     /**
      * Check if userRole is >= role
      * @param {String} userRole - role of current user
      * @param {String} role - role to check against
      */
     var hasRole = function(userRole, role) {
          return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
     };

     if ($cookies.get('token') && $location.path() !== '/logout') {
          currentUser = UserAPI.get();
          currentUser.$promise.then(user => {
               notificationService.getNotifications({userId: user._id});
          })
     }

     var Auth = {
          /**
           * Authenticate user and save token
           *
           * @param  {Object}   user     - login info
           * @param  {Function} callback - function(error, user)
           * @return {Promise}
           */
          login({
               email,
               password,
               remember,
               requestedReactivation
          }, callback ?:Function) {
               return $http.post('/auth/local', {
                    email,
                    password,
                    remember,
                    requestedReactivation
               })
                    .then(res => {
                         $cookies.put('token', res.data.token);
                         currentUser = UserAPI.get();
                         return currentUser.$promise;
                    })
                    .then(user => {
                         notificationService.getNotifications({userId: user._id});
                         safeCb(callback)(null, user);
                         return user;
                    })
                    .catch(err => {
                         Auth.logout();
                         safeCb(callback)(err.data);
                         return $q.reject(err.data);
                    });
          },

          /**
           * Delete access token and user info
           */
          logout() {
               notificationService.deleteNotifications();
               $cookies.remove('token');
               currentUser = new _User();
          },

          loginWithToken(token) {
               $cookies.put('token', token);
               currentUser = UserAPI.get();
               return currentUser.$promise;
          },

          /**
           * Create a new user
           *
           * @param  {Object}   user     - user info
           * @param  {Function} callback - function(error, user)
           * @return {Promise}
           */
          createUser(user, callback ?:Function) {
               return UserAPI.save(user, function(data) {
                    $cookies.put('token', data.token);
                    currentUser = UserAPI.get();
                    return safeCb(callback)(null, user);
               }, function(err) {
                    Auth.logout();
                    return safeCb(callback)(err);
               })
                    .$promise;
          },

          /**
           * Change password
           *
           * @param  {String}   oldPassword
           * @param  {String}   newPassword
           * @param  {Function} callback    - function(error, user)
           * @return {Promise}
           */
          changePassword(oldPassword, newPassword, callback ?:Function) {
               return UserAPI.changePassword({
                    id: currentUser._id
               }, {
                    oldPassword,
                    newPassword
               }, function() {
                    return safeCb(callback)(null);
               }, function(err) {
                    return safeCb(callback)(err);
               })
                    .$promise;
          },

          /**
           * Gets all available info on a user
           *
           * @param  {Function} [callback] - function(user)
           * @return {Promise}
           */
          getCurrentUser(callback ?:Function) {
               var value = _.get(currentUser, '$promise') ? currentUser.$promise : currentUser;

               return $q.when(value)
                    .then(user => {
                         safeCb(callback)(user);
                         return user;
                    }, () => {
                         safeCb(callback)({});
                         return {};
                    });
          },

          updateCurrentUser(data) {
               _.extend(currentUser, data);
          },

          addAccount({type, data}) {
               if (!_.get(currentUser, `accounts.${type}`)) {
                    currentUser.accounts = {[type]: []};
               }
               currentUser.accounts[type].push(data);
          },

          removeAccount({type, data}) {
               const index = _.findIndex(currentUser.accounts[type], {id: data.id});
               if (index > -1) {
                    currentUser.accounts[type].splice(index, 1);
               }
          },

          updateAccount({type, data: {id, currency}}) {
               _.each(_.filter(currentUser.accounts[type], type === 'payout' ? {currency} : _.identity), el => {
                    const sameId = el.id === id;
                    const sameCurrency = el.currency === currency;
                    const conditions = type === 'payout' ? [sameId, sameCurrency] : [sameId];
                    el.isDefault = _.every(conditions);
               });
          },

          updateFollowerList(following) {
               Util.bindArray(currentUser.following, following);
          },
          updateAuthorFollowerList(following) {
               Util.bindArray(currentUser.followingAuthors, following);
          },

          /**
           * Gets all available info on a user
           *
           * @return {Object}
           */
          getCurrentUserSync() {
               return currentUser;
          },

          /**
           * Check if a user is logged in
           *
           * @param  {Function} [callback] - function(is)
           * @return {Promise}
           */
          isLoggedIn(callback ?:Function) {
               return Auth.getCurrentUser(undefined)
                    .then(user => {
                         let is = _.get(user, 'role');

                         safeCb(callback)(is);
                         return is;
                    });
          },

          /**
           * Check if a user is logged in
           *
           * @return {Bool}
           */
          isLoggedInSync() {
               return !!_.get(currentUser, 'role');
          },

          /**
           * Check if a user has a specified role or higher
           *
           * @param  {String}     role     - the role to check against
           * @param  {Function} [callback] - function(has)
           * @return {Promise}
           */
          hasRole(role, callback ?:Function) {
               return Auth.getCurrentUser(undefined)
                    .then(user => {
                         let has = hasRole(_.get(user, 'role'), role);

                         safeCb(callback)(has);
                         return has;
                    });
          },

          /**
           * Check if a user has a specified role or higher
           *
           * @param  {String} role - the role to check against
           * @return {Bool}
           */
          hasRoleSync(role) {
               return hasRole(_.get(currentUser, 'role'), role);
          },

          /**
           * Check if a user is an admin
           *   (synchronous|asynchronous)
           *
           * @param  {Function|*} callback - optional, function(is)
           * @return {Bool|Promise}
           */
          isAdmin() {
               /*eslint-disable */
               return Auth.hasRole(...[].concat.apply(['admin'], arguments));
               /*eslint-enable */
          },

          /**
           * Check if a user is an admin
           *
           * @return {Bool}
           */
          isAdminSync() {
               return Auth.hasRoleSync('admin');//eslint-disable-line no-sync
          },
          isMerchantSync() {
               return _.get(currentUser, 'role') === 'merchant';//eslint-disable-line no-sync
          },

          /**
           * Get auth token
           *
           * @return {String} - a token string used for authenticating
           */
          getToken() {
               return $cookies.get('token');
          }
     };

     return Auth;
}
