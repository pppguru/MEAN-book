import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
     algoliaService;
     hits;
     stats;
     query;
     redirect;    
     breakpointsRecommended = [
          {
               breakpoint: 2000,
               settings: {
					          dots: true,
										slidesToScroll: 6,
                    slidesToShow: 8
               }
          },
          {
               breakpoint: 1800,
               settings: {
					          dots: true,
										slidesToScroll: 5,
                    slidesToShow: 7
               }
          },
          {
               breakpoint: 1500,
               settings: {
					          dots: true,
										slidesToScroll: 4,
                    slidesToShow: 6
               }
          },
          {
               breakpoint: 1300,
               settings: {
					          dots: true,
										slidesToScroll: 3,
                    slidesToShow: 5
               }
          },
          {
               breakpoint: 991,
               settings: {
					          dots: false,
					          swipeToSlide: true,
										slidesToScroll: 2,
                    slidesToShow: 4
               }
          },
          {
               breakpoint: 767,
               settings: {
					          dots: false,
					          swipeToSlide: true,
                    slidesToScroll: 1,
                    slidesToShow: 3
               }
          },
          {
               breakpoint: 480,
               settings: {
					          dots: false,
					          swipeToSlide: true,
                    slidesToScroll: 1,
                    slidesToShow: 2
               }
          }
     ];
     breakpointsPop = [
          {
               breakpoint: 2600,
               settings: {
									dots: true,
									slidesToScroll: 6,
									slidesToShow: 6
               }
          },
          {
               breakpoint: 991,
               settings: {
									dots: false,
									swipeToSlide: true,
									slidesToScroll: 2,
									slidesToShow: 2
               }
          },
          {
               breakpoint: 767,
               settings: {
									dots: false,
									swipeToSlide: true,
									slidesToScroll: 2,
									slidesToShow: 2
               }
          },
          {
               breakpoint: 480,
               settings: {
									dots: false,
									swipeToSlide: true,
									slidesToScroll: 1,
									slidesToShow: 1
               }
          }
     ];
     breakpointsGenre = [
          {
               breakpoint: 1200,
               settings: {
                  slidesToShow: 5
               }
          },
          {
               breakpoint: 991,
               settings: {
				          swipeToSlide: true,
                  slidesToScroll: 1,
                  slidesToShow: 4
               }
          },
          {
               breakpoint: 480,
               settings: {
									enabled: false,
									swipeToSlide: false,
									slidesToScroll: 1,
									slidesToShow: 20
               }
          }
     ];
     breakpointsReviews = [
          {
               breakpoint: 1200,
               settings: {
										slidesToScroll: 2,
	                  slidesToShow: 2
               }
          },
          {
               breakpoint: 991,
               settings: {
										swipeToSlide: true,
										slidesToScroll: 1,
										slidesToShow: 2
               }
          },
          {
               breakpoint: 767,
               settings: {
					          swipeToSlide: true,
										slidesToScroll: 1,
                    slidesToShow: 1
               }
          }
     ];
     slickConfig = {
          enabled: true,
          draggable: true,
          touchThreshold: 6,
          speed: 900,
          autoplaySpeed: 3000,
          slidesToScroll: 5,
//           infinite: true,
          dots: true,
          method: {}
     };
		 slickConfigGenre = {
          enabled: true,
          draggable: true,
          touchThreshold: 6,
          speed: 600,
					slidesToScroll: 2,
          infinite: true,
					adaptiveHeight: true
     };
     slickConfigPop = {
          enabled: true,
          draggable: true,
          touchThreshold: 6,
          speed: 900,
//           centerMode: true,
          slidesToShow: 6,
          slidesToScroll: 6,
/*  TODO: Enable these two when we got time to fiddle with the scss to accommodate for the change 
	Note: do NOT use slidesPerRow with slidesToShow
          rows: 2,
          slidesToShow: 3,
          slidesToScroll: 6,
*/
          infinite: false,
          dots: true,
					adaptiveHeight: true,
          method: {}
     };
     slickConfigNew = {
          enabled: true,
          centerMode: true,
          touchThreshold: 6,
          speed: 600,
          draggable: true,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          method: {}
     };
     slickConfigRecommended = {
          enabled: true,
          touchThreshold: 6,
//           centerMode: true,
          speed: 900,
          draggable: true,
          slidesToScroll: 5,
          infinite: true,
          dots: true,
          method: {}
     };
     slickConfigReviews = {
          enabled: true,
          draggable: true,
          touchThreshold: 6,
          speed: 1800,
          autoplay: true,
          dots: true,
          autoplaySpeed: 9000,
          slidesToScroll: 3,
          infinite: true,
          method: {}
     };
     recommended;
     genres;
     newBook;
     /*@ngInject*/
     constructor($stateParams, Auth, $state, Modal, algoliaService, bookService, genreService) {
          'ngInject';
          bookService.getRecommended();
          this.recommended = bookService.getData('recommended');
          this.newBook = bookService.getData('newThisWeek');
          genreService.getGenres();
          this.genres = genreService.getData('genres');
          this.algoliaService = algoliaService;
          this.query = '';
          this.hits = {books:[], users: []};
          this.stats = {};
          this.redirect = $state.go;
          if ($stateParams.openLogin) {
               Modal.login();
          }
          if ($stateParams.jwt) {
               console.log('$stateParams.jwt :', $stateParams.jwt);
               console.log('$stateParams.redirect :', $stateParams.redirect);
               Auth.loginWithToken($stateParams.jwt).then(() => {
                    $state.go($stateParams.redirect);
               });
          }
     }

     search(searchText) {
          this.algoliaService.search('books', searchText, {hitsPerPage: 4}).then(content => {
               console.log(content);
               this.hits.books.splice(0);
               this.hits.books.push(...content.books.hits);
               this.hits.users.splice(0);
               this.hits.users.push(...content.users.hits);
               _.extend(this.stats, _.pick(content.books, ['nbHits', 'processingTimeMS']));
          });
     }

     clear() {
          this.query = '';
          this.hits.users.splice(0);
          this.hits.books.splice(0);
     }

     tab() {
          $('a#0').focus();
     }
}

export default angular.module('bookisApp.main', [uiRouter])
     .config(routing)
     .component('main', {
          template: require('./main.html'),
          controllerAs: 'vm',
          controller: MainController
     })
     .name;
