'use strict';

export function AuthorService(AuthorAPI, toast, Auth) {
     'ngInject';

     return {
          getAuthor,
          toggleFollow,
          getAuthorBooks
     };

     function getAuthor(id) {
          return AuthorAPI.get({id}).$promise
               .then(author => author)
               .catch(err => console.log(err));
     }

     function toggleFollow(_id) {
          return AuthorAPI.toggleFollow({_id}).$promise
               .then(followers => {
                    toast.simple('Following status updated!');
                    Auth.updateAuthorFollowerList(followers);
                    return followers;
               })
               .catch(err => console.log(err));
     }

     function getAuthorBooks({author: {_id: id}}) {
          return AuthorAPI.getAuthorBooks({id}).$promise
               .then(authorBooks => authorBooks)
               .catch(err => console.log(err));
     }
}
