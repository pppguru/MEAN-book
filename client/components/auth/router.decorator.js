'use strict';

export function routerDecorator($rootScope, $state, Auth) {
     'ngInject';
     // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role

     $rootScope.$on('$stateChangeStart', (event, next) => {
          const rootState = _.first(_.split(next.name, '.'));
          const inMyZone = _.includes(['myzone', 'logout'], rootState);
          const isMerchant = Auth.isMerchantSync;//eslint-disable-line no-sync
          if (!next.authenticate) {
               return Auth.isLoggedIn()
                    .then(is => {
                         if (is) {
                              if (!isMerchant()) return;
                              if (inMyZone) return;
                              $state.go('myzone.salesbooth.active');
                         }
                    });
          }

          if (typeof next.authenticate === 'string') {
               Auth.hasRole(next.authenticate)
                    .then(has => {
                         if (has) {
                              return;
                         }

                         event.preventDefault();
                         return Auth.isLoggedIn()
                              .then(is => {
                                   $state.go(is ? 'allbooks.popular' : 'main');
                              });
                    });
          } else {
               Auth.isLoggedIn()
                    .then(is => {
                         if (is) {
                              return;
                         }

                         event.preventDefault();

                         $state.go('main');
                    });
          }
     });
}
