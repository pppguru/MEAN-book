import angular from 'angular';

export class UserProfileController {
     items;
     following:Function = (list, _id) => _.includes(_.map(list, '_id'), _id);
     mapOptions = {
          disableDefaultUI: true,
          scrollwheel: false,
          draggable: false,
          disableDoubleClickZoom: true
     };
     markerOptions = {
          draggable: false
     };
     me;
     Modal;
     requestService;
     userService;
     bookRatingService;
     bookReviewService;
     messageService;
     selectedIndex;
     viewModel;
     /*@ngInject*/
     constructor(Auth, Modal, requestService, userService, bookRatingService, bookReviewService, messageService) {
          'ngInject';
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.Modal = Modal;
          this.requestService = requestService;
          this.userService = userService;
          this.bookRatingService = bookRatingService;
          this.bookReviewService = bookReviewService;
          this.messageService = messageService;
          this.$onInit = () => {
               this.items = [
                    {name: 'Activity', template: '_activity.html'},
                    {name: 'Followers', template: '_followers.html', number: this.user.followers},
                    {name: 'Following', template: '_following.html', number: this.user.following},
                    {name: 'Have Read', template: '_have.read.html', number: this.bookshelf},
                    {name: 'Wishlist', template: '_wishlist.html', number: this.wishlist},
                    {name: 'Books for sale', template: '_books.for.sale.html', number: this.sales}
               ];
               this.viewChanged({value: 'Books for sale'})
          };
     }

     login() {
          this.Modal.login();
     }

     newMessage({user}) {
          this.Modal.newMessage({user}).then(({message}) => this.messageService.createMessage({receivers: [user._id], message}));
     }

     viewChanged({value}) {
          this.selectedIndex = _.findIndex(this.items, {name: _.get(value, 'name', value)});
          this.viewModel = this.items[this.selectedIndex];
     }

     rateBook(book) {
          this.Modal.rateBook({book})
               .then(({rate, review}) => {
                    if (review) this.bookReviewService.createReview({review}, book);
                    return this.bookRatingService.createRating(book, rate);
               })
               .then(rate => {
                    this.userService.updateBookRating(book, rate);
                    book.userRating = rate;
               })
               .catch(err => console.log('err', err));
     }

     requestBook(sale) {
          this.Modal.requestBook({sale, showUserPartial: false})
               .then(({delivery, message, price, displayedPrice}) => this.Modal.handleMissingStripeSource({
                    type: 'payment',
                    data: {
                         sale: sale._id,
                         seller: sale.seller._id,
                         delivery, message, price, displayedPrice
                    }
               }))
               .then(({data, account}) => account && this.requestService.createRequest(data));
     }

     toggleFollow({_id}) {
          this.userService.toggleFollow(_id)
               .then(() => {
                    const index = _.findIndex(this.user.followers, {_id: this.me()._id});
                    if (index >= 0) {
                         this.user.followers.splice(index, 1);
                    } else {
                         this.user.followers.push(this.me());
                    }
               });
     }
}

export default angular.module('bookisApp.userprofile', [])
     .component('bookisUserProfile', {
          template: require('./bookis-user-profile.html'),
          bindings: {
               user: '<',
               sellerBook: '<',
               wishlist: '<',
               notifications: '<',
               bookshelf: '<',
               sales: '<'
          },
          controllerAs: 'vm',
          controller: UserProfileController
     })
     .name;
