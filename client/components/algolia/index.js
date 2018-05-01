import angular from 'angular';
import algolia from 'algoliasearch';
import helper from 'algoliasearch-helper';

function algoliaService($q, appConfig) {
     'ngInject';
     const client = algolia(appConfig.envData.ALGOLIA_APP_ID, appConfig.envData.ALGOLIA_SEARCH_KEY);
     const indexes = {
          books: client.initIndex('books'),
          sales: client.initIndex('sales')
     };
     return {
          search,
          filterSales,
          filterBooks,
          top100
     };

     function search(index, searchText, options) {
          return $q((resolve, reject) => {
               const returnData = {};

               const booksHelper = helper(client, index, options)
                    .setQuery(searchText);
               const usersHelper = booksHelper.derive(searchParams => searchParams.setIndex('users').setHitsPerPage(3));
               usersHelper.on('result', data => {
                    returnData.users = data;
                    if (_.size(returnData) === 2) resolve(returnData)
               });
               booksHelper.search();

               booksHelper.on('result', data => {
                    returnData.books = data;
                    if (_.size(returnData) === 2) resolve(returnData)
               });
          });
     }

     function filterSales(query) {
          if (query.rate.min === 1) query.rate.min = 0;
          const salesIndice = helper(client, 'sales', {
               disjunctiveFacets: ['book.year', 'book.rate', 'book.genre', 'price', 'condition']
          });
          salesIndice.addNumericRefinement('book.year', '>=', query.year.min);
          salesIndice.addNumericRefinement('book.year', '<=', query.year.max);
          salesIndice.addNumericRefinement('book.rate', '>=', query.rate.min);
          salesIndice.addNumericRefinement('book.rate', '<=', query.rate.max);
          salesIndice.addNumericRefinement('price', '>=', query.price.min);
          salesIndice.addNumericRefinement('price', '<=', query.price.max);
          _.each(query.conditions, condition => salesIndice.addDisjunctiveFacetRefinement('condition', condition));
          _.each(query.genres, genre => salesIndice.addDisjunctiveFacetRefinement('book.genre', genre));
          salesIndice.on('result', data => {
               console.log('sales :', data);
          });
          salesIndice.search();
     }

     function filterBooks(query) {
          return $q(resolve => {
               if (query.rate.min === 1) query.rate.min = 0;
               const booksIndice = helper(client, 'books', {
                    disjunctiveFacets: ['year', 'rate', 'genre', 'format', 'audience']
               });
               if (query.query) booksIndice.setQuery(query.query);
               booksIndice.addNumericRefinement('year', '>=', query.year.min);
               booksIndice.addNumericRefinement('year', '<=', query.year.max);
               booksIndice.addNumericRefinement('rate', '>=', query.rate.min);
               booksIndice.addNumericRefinement('rate', '<=', query.rate.max);
               if (_.get(query, 'available.checked')) booksIndice.addNumericRefinement('available', '>=', 1);
               _.each(query.formats, format => booksIndice.addDisjunctiveFacetRefinement('format', format));
               _.each(query.ages, age => booksIndice.addDisjunctiveFacetRefinement('audience', age));
               _.each(query.genres, genre => booksIndice.addDisjunctiveFacetRefinement('genre', genre));
               booksIndice.on('result', data => resolve(data));
               booksIndice.search();
          });
     }

     function top100({genre, gender} = {}) {
          const field = !gender || _.size(gender) === 2 || _.size(gender) === 0 ? 'rate' : gender[0] === 'man' ? 'maleRate' : 'femaleRate';
          const indice = field === 'rate' ? 'books' : field === 'maleRate' ? 'books_sort_maleRate_desc' : 'books_sort_femaleRate_desc';
          return $q(resolve => {
               const top100indice = helper(client, indice, {
                    hitsPerPage: 100,
                    disjunctiveFacets: ['genre']
               });
               if (genre) top100indice.addDisjunctiveFacetRefinement('genre', genre);
               top100indice.on('result', data => resolve(data));
               top100indice.search();
          });
     }
}

export default angular.module('bookisApp.algolia', [])
     .service('algoliaService', algoliaService)
     .name;
