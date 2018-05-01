'use strict';

export function WishlistService(WishlistAPI, toast, Util, Auth) {
     'ngInject';
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getWishlist,
          createWishList,
          updateWishList
     };

     function getWishlist() {
          return WishlistAPI.query().$promise
               .then(wl => wl)
               .catch(err => console.log(err));
     }

     function createWishList(book) {
          const newWL = new WishlistAPI({
               book: book._id,
               user: me()._id
          });
          return newWL.$save()
               .then(wl => {
                    toast.simple(`${book.title} added to wish list`);
                    return wl;
               })
               .catch(err => console.log(err));
     }

     function updateWishList(wl) {
          return WishlistAPI.update(wl).$promise
               .then(w => {
                    toast.simple('Updated wish list');
                    return w;
               })
               .catch(err => console.log(err));
     }
}
