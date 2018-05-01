'use strict';

export function genres() {
     'ngInject';
     return genresFilter;

     function genresFilter(book) {
          if (!book) return 'N/A';
          const items = [];

          //Add litteray if exists
          let litterary = book['litterary'];
          if (litterary.length) {
              items.push(litterary);
          }

          //Add first genre
          let genres = _.map(book['genre'], 'no');
          if (genres.length) {
              items.push(genres[0]);
          }

          return items.length ? items.join(', ') : 'N/A';
     }
}
