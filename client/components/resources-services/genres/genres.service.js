'use strict';

export function GenreService(GenreAPI, Util, $q) {
     'ngInject';

     const data = {
          genres: [],
          mainGenres : []
     };
     return {
          getGenres,
          getMainGenres,
          getData: type => data[type]
     };

     function getGenres() {
          if (_.size(data.genres)) {
               return $q.when(data.genres);
          }
          return GenreAPI.getAll().$promise
               .then(ge => {
                    Util.bindArray(data.genres, ge);
                    return data.genres;
               })
               .catch(err => console.log(err));
     }

     function getMainGenres() {
          if (_.size(data.mainGenres)) {
               return $q.when(data.mainGenres);
          }

          return GenreAPI.getMainGenres().$promise
               .then(ge => {
                    Util.bindArray(data.mainGenres, ge);
                    return data.mainGenres;
               })
               .catch(err => console.log(err));
     }
}
