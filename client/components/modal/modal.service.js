'use strict';

import angular from 'angular';
const io = require('socket.io-client');

export function Modal($rootScope, $uibModal, Auth, $state, userService, moment, appConfig, $location, bookReviewService, $cookies,
                      $window, requestService, toast, bookService, saleService, $filter, bookRatingService, $timeout, $q) {
     'ngInject';
     const me = Auth.getCurrentUserSync; //eslint-disable-line no-sync
     function openModal(modalScope = {}, windowClass = 'modal-default', size = 'md') {
          var scope = $rootScope.$new();

          angular.extend(scope, modalScope);

          return $uibModal.open({template: require('./modal.html'), windowClass, size, scope});
     }

     const modals = {
          confirm,
          newPaymentMethod,
          newPayoutMethod,
          login,
          sellBook,
          bulkSellBooks,
          editSale,
          rateBook,
          requestBook,
          fastBuy,
          rejectWithReason,
          details,
          crop,
          takePhoto,
          newMessage,
          handleMissingStripeSource,
          handleMissingStripeMandatoryData,
          addStripeMandatoryData
     };

     return modals;

     function confirm(action, name, note) {
          const confirmModal = openModal({
               modal: {
                    dismissable: false,
                    title: `Confirm ${action}`,
                    action,
                    name,
                    note,
                    html: 'confirm.html',
                    confirm: () => confirmModal.close(),
                    cancel: () => confirmModal.dismiss()
               }
          }, 'center-modal');
          return confirmModal.result;
     }

     function handleMissingStripeSource({type, data}) {
          return handleMissingStripeMandatoryData().then(() => {
               const field = type === 'payment' ? 'paymentCustomer' : 'paymentAccount';
               const missing = _.isEmpty(me().accounts[type]) || !_.get(me()[field], 'id');
               return missing ? modals[`new${_.capitalize(type)}Method`]().then(userService.createAccount).then(account => $q.when({data, account}))
                    : $q.when({data, account: true});
          });
     }

     function handleMissingStripeMandatoryData() {
          const missing = {
               birthday: !me().birthday,
               address: !_.get(me(), 'address.coordinates[0]')
          };
          if (!_.filter(missing).length) return $q.when();
          return modals.addStripeMandatoryData({missing})
               .then(data => userService.updateCurrentUser({me: _.extend(me(), data)}))
               .then(updatedUser => $q.when(updatedUser));
     }

     function addStripeMandatoryData({missing}) {
          const data = {
               missing
          };
          const addMandatoryModal = openModal({
               modal: {
                    dismissable: true,
                    data,
                    title: 'Update profile',
                    html: 'mandatory.html',
                    submit: () => addMandatoryModal.close(_.pick(data, ['address', 'birthday']))
               }
          }, 'center-modal', 'sm');
          return addMandatoryModal.result;
     }
     
     function newPaymentMethod() {
          const data = {
               type: 'Credit card',
               usage: 'payment'
          };
          const paymentMethodModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Add payment method',
                    data,
                    cards: appConfig.payments.supported.cards,
                    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    years: _.range(moment().year(), moment().year() + 10),
                    images: appConfig.payments.supported.cardImages,
                    html: 'payment.method.html',
                    populate: valid => {//TODO: remove once live
                         data.number = valid ? 4000005780000007 : 4000005780000006;
                         data.cvc = valid ? 343 : 99;
                         data.exp_year = 2018; //eslint-disable-line camelcase
                         data.exp_month = 5; //eslint-disable-line camelcase
                         data.firstName = 'John';
                         data.lastName = 'Doe';
                    },
                    submit: () => paymentMethodModal.close(data)
               }
          }, 'center-modal', 'sm');
          return paymentMethodModal.result;
     }

     function newPayoutMethod() {
          const data = {
               usage: 'payout',
               type: 'Bank account',
               account_holder_type: 'individual'
          };
          const payoutMethodModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Add payout method',
                    data,
                    methods: appConfig.payments.supported.payout.methods,
                    types: appConfig.payouts.supported.holder_type,
                    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    years: _.range(moment().year(), moment().year() + 10),
                    html: 'payout.method.html',
                    populate: valid => {//TODO: remove once live
                         if (data.type === 'Bank account') {
                              data.account_number = valid ? 'NO89370400440532013000' : 'NO89370400440532013232'; //eslint-disable-line camelcase
                              data.account_holder_type = valid ? 'individual' : ''; //eslint-disable-line camelcase
                              data.account_holder_name = 'Some Bank'; //eslint-disable-line camelcase
                         } else if (data.type === 'Debit card') {
                              data.number = valid ? 4000005780000007 : 4000005780000006;
                              data.cvc = valid ? 343 : 99;
                              data.exp_year = 2018; //eslint-disable-line camelcase
                              data.exp_month = 5; //eslint-disable-line camelcase
                              data.firstName = 'John';
                              data.lastName = 'Doe';
                         }
                    },
                    clean: form => {
                         form.$setPristine();
                         form.$setUntouched();
                         _.each(_.keys(data), key => {
                              if (!_.includes(['usage', 'type'], key)) {
                                   delete data[key];
                              }
                         });
                    },
                    submit: () => payoutMethodModal.close(data)
               }
          }, 'center-modal', 'sm');
          return payoutMethodModal.result;
     }

     function details(book) {
          const data = {
               book,
               stats: {
                    availability: 0,
                    avgResponse: 0,
                    getResponseString() {
                         if (!this.avgResponse) return 'N/A';
                         const duration = moment.duration(this.avgResponse);
                         const h = `${duration.hours()}h:`;
                         const m = `${duration.minutes()}m`;
                         return duration.hours() ? h + m : m;
                    }
               }
          };
          userService.getStats(book.user._id)
               .then(st => _.extend(data.stats, st));

          const detailsModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Book details',
                    data,
                    html: 'details.html'
               }
          }, 'center-modal');
          return detailsModal.result;
     }

     function login({reload = false} = {}) {
          const initial = {
               login: {
                    user: {remember: false},
                    notifications: {},
                    states: {},
                    redirectState: $state.current.name === 'main' ? 'main' : $state.current.name
               },
               signup: {
                    user: {},
                    title: 'Register',
                    description: 'Enables you to track orders and save time',
                    redirectState: $state.current.name === 'main' ? 'main' : $state.current.name
               },
               merchant: {
                    user: {address: {}},
                    title: 'Register as a merchant',
                    description: 'Enables you to sell your books online',
                    redirectState: 'myzone.salesbooth.active'
               }
          };
          let data={};

          function changeModal(modal) {
               data.user = initial[modal].user;
               data.redirectState = initial[modal].redirectState;
               data.title = initial[modal].title;
               data.description = initial[modal].description;
               data.local = $location.$$host === 'localhost';
               if (initial[modal].states) data.states = initial[modal].states;
               if (initial[modal].notifications) data.notifications = initial[modal].notifications;
               data.errors = {};
               data.modal = modal;
          }

          changeModal('login');

          function reactivate() {
               submitLogin(data.user.email, data.user.password, data.user.remember, true);
          }

          function submitLogin(em, pa, re, reactivate) {
               clean();
               const loginObj = {
                    email: em || data.user.email,
                    password: pa || data.user.password,
                    remember: re || data.user.remember
               };
               if (reactivate) loginObj.requestedReactivation = true;
               Auth.login(loginObj)
                    .then(({role}) => {
                         loginModal.close();
                         if (role === 'admin') {
                              Auth.logout();
                              return toast.simple('Admin login is forbidden', undefined, 'top center');
                         }
                         $state.go(role === 'merchant' ? 'myzone.salesbooth.active' : data.redirectState, {}, {reload})
                              .then(()=> loginObj.requestedReactivation && toast.simple('Your account is reactivated!'));
                    })
                    .catch(err => {
                         data.errors.login = err.message || err;
                    });
          }

          function clean() {
               _.forOwn(data.errors, (v, k) => {
                    data.errors[k] = false;
               });
               _.forOwn(data.notifications, (v, k) => {
                    data.notifications[k] = false;
               });
          }

          function reset() {
               clean();
               data.states.reset = true;
               return userService.sendResetEmail(data.user)
                    .then(({message}) => {
                         data.states.reset = false;
                         data.states.forgot = false;
                         data.notifications.reset = message;
                    })
                    .catch(err => {
                         console.log('Err :', err);
                         let error = err.data || err;
                         data.errors.reset = error;
                         data.states.reset = false;
                         data.states.offerResendVerification = /verified/.test(error);
                    });
          }

          function resend(email) {
               clean();
               data.states.resend = true;
               return userService.resendVerificationEmail(email)
                    .then(({message}) => {
                         data.states.resend = false;
                         data.notifications.resend = message;
                         data.errors.resend = false;
                    })
                    .catch(err => {
                         data.states.resend = false;
                         data.errors.resend = err.data || err;
                    });
          }

          function submit(form) {
               const body = data.user.address ? _.extend(_.omit(data.user, 'confirmPassword'), {role: 'merchant'}) : _.omit(data.user, 'confirmPassword');
               Auth.createUser(body)
                    .then(() => {
                         $state.go(data.redirectState);
                         loginModal.close();
                    })
                    .catch(err => {
                         err = err.data;
                         // Update validity of form fields that match the mongoose errors
                         err && angular.forEach(err.errors, (error, field) => {
                              form[field].$setValidity('mongoose', false);
                              errors[field] = error.message;
                         });
                    });
          }

          const loginModal = openModal({
               modal: {
                    dismissable: true,
                    title: data.title,
                    description: data.description,
				hideLogo: true,
                    data,
                    submitLogin,
                    submit,
                    changeModal,
                    reactivate,
                    reset,
                    resend,
                    clean,
                    html: 'auth.html'
               }
          }, 'center-modal', 'sm');
          return loginModal.result;
     }

     function sellBook(sale) {
          sale = sale || {};
          function autocomplete() {
               sale.fetching = true;
               bookService.autocomplete({isbn: sale.book.isbn.full})
                    .then(isbnBook => {
                         sale.fetching = false;
                         _.extend(sale.book, _.pick(isbnBook, ['title', 'year', 'format', 'author', '_id', 'isbn']));
                         sale.book.author = _.compact(sale.book.author);//TODO remove
                    });
          }
          if (_.get(sale, 'book.isbn.full')) {
               autocomplete();
          }
          const SellBookModal = openModal({
               modal: {
                    dismissable: false,
                    title: 'sell.book',
                    years: _.range(moment().year(), moment().year() - 250, -1),
                    sale,
                    hideLogo: true,
                    autocomplete,
                    formats: appConfig.books.formats,
                    conditions: appConfig.books.conditions,
                    confirm: () => SellBookModal.close({
                         book: sale.book._id,
                         price: sale.price,
                         format: sale.format,
                         condition: sale.condition,
                         comment: sale.comment
                    }),
                    cancel: () => SellBookModal.dismiss(),
                    html: 'sell.book.html'
               }
          }, null, 'sm');
          return SellBookModal.result;
     }

     function bulkSellBooks() {
          const data = {
               validated: false,
               uploading: false,
               uploaded: false,
               progress: 0,
               total: 0,
               valid: 0
          };

          const BulkSellBooksModal = openModal({
               modal: {
                    dismissable: false,
                    title: 'Add many books for sale',
                    required: ['ISBN', 'Title', 'Condition', 'Author', 'Price'],
                    data,
                    url: full => `${$window.location.origin}/api/exports/template?access_token=${$cookies.get('token')}&full=${full}`,
                    invalidUrl: full => `${$window.location.origin}/api/exports/invalids?link=${data.invalidExportLink}`,
                    validate: () => {
                         data.validated = false;
                         data.uploaded = false;
                         bookService.bulkBookValidate(data.excelFile).then(validation => _.extend(data, validation)).then(() => {
                              data.validated = true;
                         });
                    },
                    bulk: () => {
                         const socket = io.connect();
                         socket.on('BULK_SALE_UPDATE', progressInfo => $timeout(() => _.extend(data, progressInfo)));
                         data.uploading = true;
                         bookService.bulkBookImport({file: data.excelFile, valid: data.valid}).then(() => {
                              data.uploading = false;
                              data.uploaded = true;
                              socket.disconnect();
                         })
                    },
                    finish: () => BulkSellBooksModal.close(),
                    cancel: () => BulkSellBooksModal.dismiss(),
                    html: 'bulk.sell.books.html'
               }
          }, null, '');
          return BulkSellBooksModal.result;
     }

     function editSale(sale) {
          sale = sale ? _.cloneDeep(sale) : {};
          const EditSaleModal = openModal({
               modal: {
                    dismissable: false,
                    title: 'edit.book',
                    years: _.range(moment().year(), moment().year() - 250, -1),
                    sale,
                    formats: appConfig.books.formats,
                    conditions: appConfig.books.conditions,
                    confirm: () => EditSaleModal.close(sale),
                    cancel: () => EditSaleModal.dismiss(),
                    html: 'edit.book.html'
               }
          }, null, 'sm');
          return EditSaleModal.result;
     }

     function rateBook({book}) {
          const data = {
               book,
               rate: book.userRating || 0,
               review: '',
               resolved: false,
               alreadyReviewed: []
          };
          bookReviewService.getBookReviews({book, userId: me()._id}).then(rew => {
               data.resolved = true;
               data.alreadyReviewed = rew;
          });
          if (!book.hasOwnProperty('userRating')) {
               bookRatingService.getMyRating(book).then(() => {
                    data.rate = _.get(bookRatingService.getData('myRate'), '[0].rate', 0);
               });
          }
          const RateBookModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'rate.book',
                    updateRating: ({rating}) => {
                         data.rate = rating;
                    },
                    data,
                    confirm: () => RateBookModal.close(data),
                    html: 'rate.book.html'
               }
          }, 'center-modal', 'sm');
          return RateBookModal.result;
     }

     function requestBook({sale, showUserPartial}) {
          const request = {
               sale: _.cloneDeep(sale),
               delivery: 'delivery',
               price: sale.price,
               showUserPartial,
               measureTemplates: appConfig.books.measureTemplates,
               stats: {
                    availability: 0,
                    avgResponse: 0,
                    getResponseString() {
                         if (!this.avgResponse) return 'N/A';
                         const duration = moment.duration(this.avgResponse);
                         const h = `${duration.hours()}h:`;
                         const m = `${duration.minutes()}m`;
                         return duration.hours() ? h + m : m;
                    }
               }
          };

          userService.getStats(sale.seller._id)
               .then(st => _.extend(request.stats, st));

          function getMethods() {
               if (request.delivery !== 'shipping') return request.price = request.sale.price;//eslint-disable-line no-return-assign
               request.sale.book.measure.weight && requestService.getShippingMethods(sale.seller.address.zip, request.sale.book.measure)
                    .then(methods => {
                         if (!request.selectedMethod) request.selectedMethod = 'A-POST';
                         request.methods = methods;
                         updateDetails();
                    });
          }

          function updateDetails() {
               const index = _.findIndex(request.methods, {ProductId: request.selectedMethod});
               request.details = request.methods[index];
               request.price = request.sale.price + +_.get(request, 'details.Price.PackagePriceWithoutAdditionalServices.AmountWithVAT', 0);
          }

          function setMeasures(i) {
               _.extend(request.sale.book.measure, _.omit(appConfig.books.measureTemplates[i], ['image']));
               getMethods();
          }

          function undo() {
               request.sale.book.measure = {width: 0, height: 0, thickness: 0, weight: 0};
          }

          userService.getUserSentRequests(undefined, sale)
               .then(res => {
                    request.requested = !!res.length;
                    if (request.requested) {
                         request.delivery = res[0].delivery;
                         request.message = res[0].message;
                    }
               });
          const options = {
               mapOptions: {
                    disableDefaultUI: true,
                    scrollwheel: false,
                    draggable: false,
                    disableDoubleClickZoom: true
               },
               markerOptions: {
                    draggable: false
               }
          };
          const RequestBookModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'request.to.buy',
                    getMethods,
                    updateDetails,
                    setMeasures,
                    undo,
                    request,
                    options,
                    confirm: () => RequestBookModal.close(_.extend({displayedPrice: $filter('salePrice')(request.price)}, _.pick(request, ['price', 'delivery', 'message']))),
                    html: 'request.book.html'
               }
          }, null, showUserPartial ? '' : 'sm');
          return RequestBookModal.result;
     }

     function fastBuy(book) {
          const request = {
               collapsed: true,
               book
          };
          book.sales[0] && saleService.getSale(book.sales[0])
               .then(sale => {
                    request.sale = sale;
               });
          const FastBuyModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'fast.buy',
                    request,
                    confirm: () => FastBuyModal.close(_.pick(request, ['delivery', 'message'])),
                    html: 'fast.buy.html'
               }
          }, null, '');
          return FastBuyModal.result;
     }

     function rejectWithReason(action, title) {
          const data = {
               action, title
          };
          const RejectReasonModal = openModal({
               modal: {
                    dismissable: false,
                    title: `${action}.request`,
                    data,
                    confirm: () => RejectReasonModal.close(data),
                    cancel: () => RejectReasonModal.dismiss(),
                    html: 'reject.html'
               }
          }, 'center-modal', 'sm');
          return RejectReasonModal.result;
     }

     function crop(file) {
          const image = {
               file,
               cropped: undefined
          };
          const CropModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'crop.header',
                    image,
                    crop: () => CropModal.close(image),
                    html: 'crop.html'
               }
          }, 'center-modal', 'sm');
          return CropModal.result;
     }

     function newMessage({user}) {
          const data = {
               user
          };
          const MessageModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'send.message',
                    data,
                    confirm: () => MessageModal.close(data),
                    html: 'new.message.html'
               }
          }, 'center-modal', 'sm');
          return MessageModal.result;
     }

     function takePhoto() {
          let data = {
               video: null,
               patData: null,
               patOpts: {x: 0, y: 0, w: 25, h: 25},
               channel: {}
          };

          function getVideoData(x, y, w, h) {
               let hiddenCanvas = document.createElement('canvas');
               hiddenCanvas.width = data.video.width;
               hiddenCanvas.height = data.video.height;
               let ctx = hiddenCanvas.getContext('2d');
               ctx.drawImage(data.video, 0, 0, data.video.width, data.video.height);
               return ctx.getImageData(x, y, w, h);
          }

          function onSuccess() {
               data.video = data.channel.video;
               data.patOpts.w = data.video.width;
               data.patOpts.h = data.video.height;
          }

          const TakePhotoModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Take Your Photo',
                    onSuccess,
                    data,
                    makeSnapshot: () => {
                         if (data.video) {
                              let patCanvas = document.querySelector('#snapshot');
                              if (!patCanvas) return;

                              patCanvas.width = data.video.width;
                              patCanvas.height = data.video.height;
                              let ctxPat = patCanvas.getContext('2d');

                              let idata = getVideoData(data.patOpts.x, data.patOpts.y, data.patOpts.w, data.patOpts.h);
                              ctxPat.putImageData(idata, 0, 0);
                              TakePhotoModal.close({img: patCanvas.toDataURL()});
                              data.patData = idata;
                         }
                    },
                    html: 'take.image.html'
               }
          }, 'center-modal', 'sm');
          return TakePhotoModal.result;
     }
}

export default angular.module('bookisApp.Modal', [])
     .factory('Modal', Modal)
     .name;
