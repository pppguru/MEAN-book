'use strict';

export function BookshelfService(BookshelfAPI, toast, Util, Auth) {
     'ngInject';
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getBookshelf,
          createBookshelf,
          updateBookshelf
     };

     function getBookshelf() {
          return BookshelfAPI.query().$promise
               .then(bs => bs)
               .catch(err => console.log(err));
     }

     function createBookshelf(book, isRead) {
          const newBS = new BookshelfAPI({
               book: book._id,
               read: isRead || false,
               user: me()._id
          });
          return newBS.$save()
               .then(bs => {
                    toast.simple(`${book.title} added to bookshelf`);
                    return bs;
               })
               .catch(err => console.log(err));
     }

     function updateBookshelf(shelf) {
          return BookshelfAPI.update(shelf).$promise
               .then(bs => {
                    toast.simple('Updated bookshelf');
                    return bs;
               })
               .catch(err => console.log(err));
     }
}
