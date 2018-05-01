'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util) {
     'ngInject';

     var state;
     return {
          // Add authorization token to headers
          request(config) {
               config.headers = config.headers || {};
               if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
                    config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
               }
               return config;
          },

          // Intercept 401s and redirect you to login/main
          responseError(response) {
               if (response.status === 401) {
                    let injectedAuth = $injector.get('Auth');
                    injectedAuth.logout();
                    const previous = (state || (state = $injector.get('$state'))).current.name;
                    (state || (state = $injector.get('$state')))
                         // .go('login');
                         .go(previous);
               }
               return $q.reject(response);
          }
     };
}
