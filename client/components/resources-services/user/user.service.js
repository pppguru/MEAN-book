'use strict';

export function UserService(UserAPI, Auth, Upload, Util, toast, requestService, saleService, $q, $state) {
     'ngInject';

     const generateFullAddress = ({streetAddress = '', streetNumeric = '', zip = '', city = '', country = ''}) => `${streetAddress} ${streetNumeric}, ${zip}, ${city} ${country}`;
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync

     const requestStatuses = ['pending', 'declined', 'waiting', 'delivered', 'requested'];
     const data = {
          books: {
               all: [], //private
               active: [],
               requested: [],
               activeAndRequested: [],
               sold: []
          },
          sales: {
               all: [], //private
               available: [],
               requested: [],
               availableAndRequested: [],
               sold: []
          },
          conversations: {
               all: []
          },
          requests: {
               incoming: {
                    all: [], //private
                    aggregated: [],
                    pending: {
                         all: [],
                         unseen: []
                    },
                    waiting: {
                         all: [],
                         unseen: []
                    },
                    requested: { //waiting+pending
                         all: [],
                         unseen: []
                    },
                    delivered: {
                         all: [],
                         unseen: []
                    },
                    declined: {
                         all: [],
                         unseen: []
                    }
               },
               both: {
                    all: {
                         all: []
                    }
               },
               sent: {
                    all: [], //private
                    aggregated: [],
                    pending: {
                         all: [],
                         unseen: []
                    },
                    waiting: {
                         all: [],
                         unseen: []
                    },
                    requested: { //waiting+pending
                         all: [],
                         unseen: []
                    },
                    delivered: {
                         all: [],
                         unseen: []
                    },
                    declined: {
                         all: [],
                         unseen: []
                    }
               }
          },
          wishlist: {
               all: [],
               public: []
          },
          bookshelf: {
               all: [],
               read: [],
               aggregation: [],
               public: []
          }
     };

     return {
          getUser,
          getNearUsers,
          createAccount,
          deleteAccount,
          setAsUserDefaultAccount,
          getUsers,
          getStats,
          verifyEmail,
          resendVerificationEmail,
          resetPasswordWithToken,
          sendResetEmail,
          updateCurrentUser,
          updateCurrentUserProfileImage,
          updateNotification,
          changePassword,
          setPassword,
          generateFullAddress,
          getUserSales,
          getData: (source, type) => data[source][type],
          updateBookRating,
          getUserRequests,
          getUserConversations,
          getUserIncomingRequests,
          getUserSentRequests,
          getUserWishList,
          getUserWaitinglist,
          getUserPublicWishList,
          getUserBookshelf,
          getUserPublicBookshelf,
          fetchRequests: (direction, state, type) => data.requests[direction][state][type],
          approveRequest: req => requestService.approveRequest(req).then(handleApprovedRequests(req)),
          declineRequest: req => requestService.declineRequest(req).then(handleDeclinedRequests(req)),
          deliverRequest: req => requestService.deliverRequest(req).then(handleDeliveredRequests(req)),
          cancelRequest: req => requestService.cancelRequest(req).then(handleCanceledRequests(req)),
          createSale: sale => saleService.createSale(sale).then(handleCreatedSale),
          editSale: sale => saleService.editSale(sale).then(handleEditedSale),
          removeSale: sale => saleService.removeSale(sale).then(handleRemovedSale),
          getRequests: (states, direction, type) => _.reduce(states, (agg, state) => agg.concat([data.requests[direction][state][type]]), []),
          getWishList: type => data.wishlist[type],
          getBookShelf: type => data.bookshelf[type],
          alreadyRequested: _id => _.findIndex(data.requests.sent.all, e => _.includes(['pending', 'waiting'], e.status) && e.sale.book._id === _id) >= 0,
          markAsSeen,
          getRequestsAggregation,
          getBookShelfAggregation,
          toggleFollow,
          createRequestHandler,
          createBookshelfHandler,
          getProfileProgress,
          deactivateAccount,
     };

     function getUsers() {
          return null;
     }
     
     function getNearUsers() {
          return UserAPI.getNear({userId: me()._id}).$promise
               .then(users => users)
               .catch(err => {
                    console.log('Err :', err);
               });
     }

     function createAccount(_data) {
          return UserAPI.createAccount({id: me()._id}, _data).$promise
               .then(resp => {
                    Auth.addAccount({type: _data.usage, data: resp});
                    toast.simple(`Successfully added ${_data.usage} method!`);
                    return resp;
               })
               .catch(err => {
                    toast.error(err.data || 'Something went wrong', 6000);
                    console.log('Err :', err);
               });
     }

     function deleteAccount({type, data: _data}) {
          console.log('_data :', _data);
          console.log('data :', data);
          return UserAPI.deleteAccount({id: me()._id, type: _data.id}).$promise
               .then(resp => {
                    Auth.removeAccount({type, data: _data});
                    toast.simple(`Successfully deleted ${type} method!`);
                    return resp;
               })
               .catch(err => {
                    toast.error(err.data || 'Something went wrong', 6000);
                    console.log('Err :', err);
               });
     }

     function setAsUserDefaultAccount({type, data: {id: _type}}) {
          return UserAPI.setAsDefaultAccount({_id: me()._id, _type}).$promise
               .then(resp => {
                    Auth.updateAccount({type, data: resp});
                    toast.simple(`Updated default ${type} method!`);
                    return resp;
               })
               .catch(err => {
                    toast.error(err.data || 'Something went wrong', 6000);
                    console.log('Err :', err);
               });
     }

     function getUser(id) {
          return UserAPI.get({id}).$promise
               .then(user => user)
               .catch(err => console.log(err));
     }

     function getStats(id) {
          return UserAPI.getStats({id}).$promise
               .then(stats => stats)
               .catch(err => console.log(err));
     }

     function verifyEmail(token) {
          return UserAPI.verifyEmail({token}).$promise
               .then(() => Auth.updateCurrentUser({verifications: {email: true}}))
               .catch(err => console.log(err));
     }

     function resendVerificationEmail(email = me().email) {
          return UserAPI.resendVerificationEmail({email}).$promise
               .then(() => toast.simple(`Verification email sent to ${email}`))
               .catch(err => console.log(err));
     }

     function resetPasswordWithToken(_data) {
          return UserAPI.resetPasswordWithToken(_data).$promise;
     }

     function sendResetEmail(user) {
          return UserAPI.sendResetEmail(user).$promise;
     }

     function updateCurrentUser(ctrl, form, type) {
          return UserAPI.updateCurrentUser(ctrl.me).$promise
               .then(() => {
                    Auth.updateCurrentUser(ctrl.me);
                    if (form) Util.resetForm(form);
                    ctrl.me = _.cloneDeep(ctrl.me);
                    if (ctrl.origin) ctrl.origin = _.cloneDeep(ctrl.me);
                    toast.simple(`Successfully updated ${type}!`);
               })
               .catch(err => console.log(err));
     }

     function updateCurrentUserProfileImage(image, ctrl) {
          const file = Upload.dataUrltoBlob(image.base64, 'profile_image');
          image.uploading = true;
          Upload.upload({method: 'PATCH', url: `api/users/${ctrl.me._id}/profile`, data: {file}})
               .then(({data: _data}) => {
                    ctrl.me.imageUrl = _data;
                    Auth.updateCurrentUser({imageUrl: _data});
                    image.uploading = false;
                    image.base64 = null;
                    ctrl.origin = _.cloneDeep(ctrl.me);
                    toast.simple('Profile image uploaded successfully!');
               }, err => {
                    console.log('Err :', err);
                    image.uploading = false;
               });
     }

     function updateNotification(_id, notification) {
          UserAPI.updateNotification(_.extend({_id}, notification)).$promise
               .then(() => toast.simple('Notification updated!', 100));
     }

     function changePassword(ctrl, form) {
          if (form.$valid) {
               Auth.changePassword(ctrl.user.oldPassword, ctrl.user.newPassword)
                    .then(() => {
                         Util.resetForm(form);
                         _.forOwn(ctrl.user, (v, k) => {
                              ctrl.user[k] = '';
                         });
                         toast.simple('Successfully changed password!');
                    })
                    .catch(() => {
                         form.password.$setValidity('mongoose', false);
                         ctrl.errors.other = 'Incorrect password';
                    });
          }
     }

     function setPassword(ctrl, form) {
          const password = _.get(ctrl, 'user.newPassword');
          if (form.$valid) {
               UserAPI.setPassword({password}).$promise
                    .then(() => {
                         Util.resetForm(form);
                         _.forOwn(ctrl.user, (v, k) => {
                              ctrl.user[k] = '';
                         });
                         Auth.updateCurrentUser({password: true});
                         toast.simple('Password is set!');
                    })
                    .catch(() => {
                         form.password.$setValidity('mongoose', false);
                         ctrl.errors.other = 'Incorrect password';
                    });
          }
     }

     function getUserSales(user) {
          return UserAPI.getSales({id: user._id, userId: me()._id}).$promise
               .then(s => {
                    Util.bindArray(data.sales.all, s);
                    Util.bindArray(data.sales.availableAndRequested, _.filter(data.sales.all, e => _.includes(['available', 'requested'], e.status)));
                    Util.bindArray(data.sales.requested, _.filter(data.sales.all, {status: 'requested'}));
                    Util.bindArray(data.sales.available, _.filter(data.sales.all, {status: 'available'}));
                    Util.bindArray(data.sales.sold, _.filter(data.sales.all, {status: 'sold'}));
                    return data.sales.all;
               })
               .catch(err => console.log(err));
     }

     function updateBookRating(book, rate) {
          const ownerRate = _.get(book, 'userRating');
          const oldVotes = _.get(book, 'rating.votes');
          const oldAvg = _.get(book, 'rating.avg');
          _.each([data.sales.availableAndRequested, data.sales.all], saleSet => {
               _.each(saleSet, (sale, i) => {
                    if (sale.book._id === book._id) {
                         if (ownerRate) {
                              let newTotal = oldAvg * oldVotes - ownerRate;
                              newTotal += rate;
                              saleSet[i].book.userRating = rate;
                              saleSet[i].book.rating.avg = newTotal / oldVotes;
                         } else {
                              saleSet[i].book.userRating = rate;
                              saleSet[i].book.rating.avg = (oldVotes * oldAvg + rate) / (oldVotes + 1);
                              saleSet[i].book.rating.votes++;
                         }
                    }
               });
          });
     }

     function getUserRequests({_id: id}) {
          if (!id) id = me()._id;
          if (!id) return $q.when([]);
          return UserAPI.getRequests({id}).$promise
               .then(allRequests => {
                    _.remove(data.conversations.all, 'seller');
                    data.conversations.all.push(...allRequests);
                    const partition = _.partition(allRequests, e => e.seller._id === id);
                    _.each(['incoming', 'sent'], (direction, i) => {
                         Util.bindArray(data.requests[direction].all, partition[i]);
                         _.each(requestStatuses, status => {
                              Util.bindArray(data.requests[direction][status].all, _.filter(partition[i], e => status !== 'requested' ? e.status === status : _.includes(['pending', 'waiting'], e.status)));
                              Util.bindArray(data.requests[direction][status].unseen, _.filter(data.requests[direction][status].all, e => !e.seen[direction === 'incoming' ? 'seller' : 'user']));
                         });
                    });
                    console.log('Data :', data);
               })
               .catch(err => console.log(err));
     }

     function getUserConversations({_id: id}) {
          if (!id) id = me()._id;
          if (!id) {
               data.conversations.all.splice(0);
               return $q.when([]);
          }
          return UserAPI.getConversations({id}).$promise
               .then(allConversations => {
                    _.remove(data.conversations.all, 'participants');
                    data.conversations.all.push(...allConversations);
                    return data.conversations.all;
               })
               .catch(err => console.log(err));
     }

     function getUserIncomingRequests(user) {
          if (!user) user = me();
          if (!user._id) return $q.when([]);
          const query = {id: user._id};
          return UserAPI.getIncomingRequests(query).$promise
               .then(incoming => {
                    Util.bindArray(data.requests.incoming.all, incoming);
                    _.each(requestStatuses, status => {
                         Util.bindArray(data.requests.incoming[status].all, _.filter(incoming, {status}));
                         Util.bindArray(data.requests.incoming[status].unseen, _.filter(data.requests.incoming[status].all, e => !e.seen.user));
                    });
                    return data.requests.incoming.all;
               })
               .catch(err => console.log(err));
     }

     function getUserSentRequests(user, sale) {
          if (!user) user = me();
          if (!user._id) return $q.when([]);
          const query = {id: user._id};
          if (sale) query.saleId = sale._id || sale;
          return UserAPI.getSentRequests(query).$promise
               .then(sent => sent)
               .catch(err => console.log(err));
     }

     function getRequestsAggregation(direction, user, year, statuses) {
          if (!user) user = me();
          if (!user._id) {
               data.requests[direction].aggregated.splice(0);
               return $q.when([]);
          }
          const query = {id: user._id};
          return UserAPI[direction === 'incoming' ? 'getIncomingRequestsAggregation' : 'getSentRequestsAggregation'](_.extend(query, {year, statuses})).$promise
               .then(sent => {
                    Util.bindArray(data.requests[direction].aggregated, sent);
                    return data.requests[direction].aggregated;
               })
               .catch(err => console.log(err));
     }

     function getUserWishList(user, book) {
          if (!user) user = me();
          if (!user._id) {
               data.wishlist.all.splice(0);
               return $q.when([]);
          }
          const query = {id: user._id};
          if (book) query.bookId = book._id;
          return UserAPI.getWishList(query).$promise
               .then(wl => {
                    if (query.bookId) return wl;
                    Util.bindArray(data.wishlist.all, wl);
                    return data.wishlist.all;
               })
               .catch(err => console.log(err));
     }

     function getUserWaitinglist({book: {_id: bookId}}) {
          if (!me()._id) {
               return $q.when([]);
          }
          const query = {id: me()._id};
          if (bookId) query.bookId = bookId;
          return UserAPI.getWaitinglist(query).$promise
               .then(wl => wl)
               .catch(err => console.log(err));
     }

     function getUserPublicWishList(user) {
          return UserAPI.getPublicWishList({id: user._id}).$promise
               .then(wl => {
                    Util.bindArray(data.wishlist.public, wl);
                    return data.wishlist.public;
               })
               .catch(err => console.log(err));
     }

     function getUserBookshelf(user, book) {
          if (!user) user = me();
          if (!user._id) {
               data.bookshelf.all.splice(0);
               return $q.when([]);
          }
          const query = {id: user._id};
          if (book) query.bookId = book._id;
          return UserAPI.getBookshelf(query).$promise
               .then(bs => {
                    Util.bindArray(data.bookshelf.all, bs);
                    Util.bindArray(data.bookshelf.read, _.filter(bs, 'read'));
                    return data.bookshelf.all;
               })
               .catch(err => console.log(err));
     }

     function getUserPublicBookshelf(user) {
          return UserAPI.getPublicBookshelf({id: user._id}).$promise
               .then(bs => {
                    Util.bindArray(data.bookshelf.public, bs);
                    return data.bookshelf.public;
               })
               .catch(err => console.log(err));
     }

     function getBookShelfAggregation(user, year) {
          if (!user) user = me();
          if (!user._id) return $q.when([]);
          const query = {id: user._id};
          return UserAPI.getBookShelfAggregation(_.extend(query, {year})).$promise
               .then(bs => {
                    Util.bindArray(data.bookshelf.aggregation, bs);
                    return data.bookshelf.aggregation;
               })
               .catch(err => console.log(err));
     }

     function markAsSeen(direction, statuses, type) {
          _.each(statuses, status => {
               if (_.isEmpty(data.requests[direction][status].unseen)) return;
               const notSeenIds = _.map(data.requests[direction][status].unseen, '_id');
               requestService.markSeen(notSeenIds, type)
                    .then(() => {
                         _.each(notSeenIds, _id => {
                              const index = _.findIndex(data.requests[direction][status].all, {_id});
                              data.requests[direction][status].all[index].seen[type] = new Date();
                         });
                         data.requests[direction][status].unseen.splice(0);
                    })
                    .catch(err => console.log('err: ', err));
          });
     }

     function toggleFollow(userId) {
          return UserAPI.toggleFollow({_id: me()._id, userId}).$promise
               .then(following => {
                    toast.simple('Following status updated!');
                    Auth.updateFollowerList(following);
                    return following;
               })
               .catch(err => console.log('err: ', err));
     }

     /* SALES HANDLERS */
     function handleCreatedSale(s) {
          _.each([data.sales.all, data.sales.availableAndRequested, data.sales.available], el => el.unshift(s));
          return s;
     }
     function handleEditedSale(s) {
          _.each([data.sales.all, data.sales.availableAndRequested], el => {
               const index = _.findIndex(el, {_id: s._id});
               el[index] = s;
          });
     }
     function handleRemovedSale(s) {
          _.each([data.sales.all, data.sales.availableAndRequested, data.sales.available], el => {
               const index = _.findIndex(el, {_id: s._id});
               el.splice(index, 1);
          });
     }

     /* BOOKSHELF HANDLERS */
     function createBookshelfHandler(b) {
          _.remove(data.wishlist.all, e => e.book._id === b.book._id);
          data.bookshelf.all.push(b);
     }

     /* REQUEST HANDLERS */
     function handleApprovedRequests(req) {
          const index = _.findIndex(data.requests.incoming.pending.all, {_id: req._id});
          req.seen.user = undefined;
          data.requests.incoming.pending.all.splice(index, 1);
          data.requests.incoming.waiting.all.push(req);
          _.remove(data.requests.incoming.pending.unseen, {_id: req._id});//if approving from messages
          data.requests.incoming.waiting.unseen.push(req);
     }
     function handleDeclinedRequests(req) {
          const reqIndex = _.findIndex(data.requests.incoming.pending.all, {_id: req._id});
          const bookIndex = _.findIndex(data.sales.availableAndRequested, {_id: req.sale._id});
          data.requests.incoming.pending.all.splice(reqIndex, 1);
          data.sales.availableAndRequested[bookIndex].status = 'available';
          data.sales.available.push(req.sale.book);
     }
     function handleDeliveredRequests(req) {
          _.remove(data.requests.incoming.waiting.all, {_id: req._id});
          _.remove(data.requests.incoming.waiting.unseen, {_id: req._id});//if approving from messages
          req.seen.user = undefined;
          data.requests.incoming.delivered.all.push(req);
          data.requests.incoming.delivered.unseen.push(req);
          _.remove(data.sales.availableAndRequested, {_id: req.sale._id});
     }
     function handleCanceledRequests(req) {
          _.remove(data.requests.sent.pending.all, {_id: req._id});
          _.remove(data.requests.sent.requested.all, {_id: req._id});
     }
     function createRequestHandler(req) {
          data.requests.sent.all.push(req);
          data.requests.sent.pending.all.push(req);
          data.requests.sent.pending.unseen.push(req);
     }

     function getProfileProgress() {
          if (!me()._id) return {};
          return {
               'Your name missing': !!(me().businessName || (me().firstName && me().lastName)), //eslint-disable-line no-extra-parens
               'Your genre missing': !!me().gender,
               'Please upload your profile image': !!me().imageUrl,
               'Your birthday missing': !!me().birthday,
               'Your email address missing': !!me().email,
               'Your phone number missing': !!me().phone,
               'About you missing': !!me().about,
               'Important: Set you password': !!me().password,
               'Your address missing': !!_.get(me(), 'address.coordinates[0]'),
               'Your email is not verified': !!me().verifications.email,
               'Your delivery method is not set': !!(me().delivery.shipping.enabled || me().delivery.meetup.enabled) //eslint-disable-line no-extra-parens
          };
     }

     function deactivateAccount() {
          if (!me()._id) return;
          return UserAPI.deactivateAccount(me()).$promise
               .then(() => {
                    Auth.logout();
                    $state.go('main').then(() => toast.simple('Your account is deactivated'))
               })
               .catch(err => console.log(err));
     }
}
