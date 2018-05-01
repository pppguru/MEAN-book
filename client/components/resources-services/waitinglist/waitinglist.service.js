'use strict';

export function WaitinglistService(WaitinglistAPI, Util, Auth, toast) {
     'ngInject';
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getWaitinglist,
          createWaitinglist
     };

     function getWaitinglist() {
          return WaitinglistAPI.query().$promise
               .then(wl => wl)
               .catch(err => console.log(err));
     }

     function createWaitinglist(book) {
          const newWL = new WaitinglistAPI({
               book: book._id,
               user: me()._id
          });
          return newWL.$save()
               .then(wl => {
                    toast.simple(`${book.title} added to waiting list`);
                    return wl;
               })
               .catch(err => console.log(err));
     }

}
