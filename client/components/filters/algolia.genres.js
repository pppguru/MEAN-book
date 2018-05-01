'use strict';

export function algoliaGenres(genreService) {
     'ngInject';
     let genres = genreService.getData('genres');
     let serviceInvoked = !!_.size(genres);

     function genreFilter(value) {
          if (!value) return;
          return _.map(_.filter(genres, g => _.includes(value, g._id)), 'no').join(', ');
     }

     asyncWrapper.$stateful = true;
     function asyncWrapper(value) {
          if (_.size(genres)) return genreFilter(value);
          if (serviceInvoked) return '-';
          serviceInvoked = true;
          genreService.getGenres();
     }

     return asyncWrapper;
}
