import angular from 'angular';

export class UserProfileController {
     items;
     following:Function = (list, _id) => _.includes(_.map(list, '_id'), _id);
     Modal;
     requestService;
     selectedIndex;
     viewModel;
     authorService;
     me;
     author;
     q;
     /*@ngInject*/
     constructor(Auth, Modal, requestService, authorService, $q) {
          'ngInject';
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.q = $q;
          this.Modal = Modal;
          this.requestService = requestService;
          this.authorService = authorService;
          this.$onInit = () => {
               this.items = [
                    {name: 'Works', template: '_works.html', number: this.books},
                    {name: 'Discussion', template: '_discussion.html'},
                    {name: 'Followers', template: '_author_followers.html', number: this.author.followers}
               ];
               this.viewChanged({value: 'Works'})
          };
     }

     viewChanged({value}) {
          this.selectedIndex = _.findIndex(this.items, {name: _.get(value, 'name', value)});
          this.viewModel = this.items[this.selectedIndex];
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
          const wasLoggedIn = !!this.me()._id;
          const promise = wasLoggedIn ? this.q.when() : this.Modal.login();
          promise.then(() => this.authorService.toggleFollow(_id))
               .then(() => {
                    const index = _.findIndex(this.author.followers, {_id: this.me()._id});
                    if (index >= 0) {
                         this.author.followers.splice(index, 1);
                    } else {
                         this.author.followers.push(this.me());
                    }
               });
     }
}

export default angular.module('bookisApp.authorprofile', [])
     .component('bookisAuthorProfile', {
          template: require('./bookis-author-profile.html'),
          bindings: {
               books: '<',
               author: '<',
               sellerBook: '<'
          },
          controllerAs: 'vm',
          controller: UserProfileController
     })
     .name;
