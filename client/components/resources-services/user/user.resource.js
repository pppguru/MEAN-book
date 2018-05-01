'use strict';

export function UserResource($resource) {
     'ngInject';

     return $resource('/api/users/:id/:controller/:type/:sub', {
          id: '@_id', type: '@_type'
     }, {
          changePassword: {
               method: 'PUT',
               params: {
                    controller: 'password'
               }
          },
          verifyEmail: {
               method: 'PATCH',
               params: {
                    id: 'verifications',
                    controller: 'email'
               }
          },
          sendResetEmail: {
               method: 'POST',
               params: {
                    id: 'password',
                    controller: 'email'
               }
          },
          resendVerificationEmail: {
               method: 'POST',
               params: {
                    id: 'verifications',
                    controller: 'email'
               }
          },
          resetPasswordWithToken: {
               method: 'POST',
               params: {
                    id: 'password',
                    controller: 'reset'
               }
          },
          setPassword: {
               method: 'POST',
               params: {
                    id: 'password',
                    controller: 'set'
               }
          },
          updateCurrentUser: {
               method: 'PUT'
          },
          updateNotification: {
               method: 'PATCH',
               params: {
                    controller: 'notifications'
               }
          },
          toggleFollow: {
               method: 'PATCH',
               isArray: true,
               params: {
                    controller: 'following'
               }
          },
          get: {
               method: 'GET',
               params: {
                    id: 'me'
               }
          },
          getStats: {
               method: 'GET',
               params: {
                    controller: 'stats'
               }
          },
          getSales: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'sales'
               }
          },
          getIncomingRequestsAggregation: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'incoming',
                    sub: 'aggregation'
               }
          },
          getIncomingRequests: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'incoming'
               }
          },
          getSentRequestsAggregation: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'sent',
                    sub: 'aggregation'
               }
          },
          getSentRequests: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'sent'
               }
          },
          getRequests: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests'
               }
          },
          getConversations: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'conversations'
               }
          },
          getWishList: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'wishlist'
               }
          },
          getWaitinglist: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'waitinglist'
               }
          },
          getPublicWishList: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'wishlist',
                    type: 'public'
               }
          },
          getBookshelf: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'bookshelf'
               }
          },
          getNear: {
               isArray: true,
               method: 'GET',
               params: {
                    id: 'near'
               }
          },
          getPublicBookshelf: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'bookshelf',
                    type: 'public'
               }
          },
          getBookShelfAggregation: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'bookshelf',
                    type: 'aggregation'
               }
          },
          createAccount: {
               method: 'POST',
               params: {
                    controller: 'accounts'
               }
          },
          deleteAccount: {
               method: 'DELETE',
               params: {
                    controller: 'accounts'
               }
          },
          setAsDefaultAccount: {
               method: 'PATCH',
               params: {
                    controller: 'accounts'
               }
          },
          deactivateAccount: {
               method: 'PATCH',
               params: {
                    controller: 'deactivate'
               }
          }
     });
}
