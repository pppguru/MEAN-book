import angular from 'angular';
import moment from 'moment';

export class BookisFilterController {
     options;
     collapsed;
     genres;
     ages;
     conditions;
     deliveries;
     formats;
     defaults;
     cloned;
     /*@ngInject*/
     constructor(appConfig, genreService, $state) {
          'ngInject';
          genreService.getGenres();
          this.defaults = {
               year: {
                    min: 1900,
                    max: moment().year()
               },
               rate: {
                    min: 0,
                    max: 5
               },
               available: {
                    checked: false
               }
          };
          this.$onInit = () => {
               this.options = {
                    rate: {
                         step: 0.1,
                         precision: 2,
                         floor: 1,
                         ceil: 5,
                         showTicks: 1,
                         showTicksValues: true,
                         onChange: this.debounced
                    },
                    price: {
                         step: 10,
                         floor: 0,
                         ceil: 2000,
                         showTicks: 500,
                         showTicksValues: true,
                         onChange: this.debounced
                    },
                    year: {
                         step: 1,
                         floor: 1900,
                         ceil: 2017,
                         onChange: this.debounced
                    }
               };
               this.cloned = _.cloneDeep(this.selected);
          };
          this.conditions = appConfig.books.conditions;
          this.deliveries = ['shipping', 'meetup'];
          this.formats = appConfig.books.formats;
          this.genres = genreService.getData('genres');
          this.buyings = ['request', 'add to cart'];
          this.ages = appConfig.books.ages;
          if ($state.current.name === 'kids') {
               this.ages = _.filter(this.ages, e => e !== 'Voksen');
          }
          this.categories = ['Top 100', 'Best book of the month', 'New releases'];
          this.collapsed = {
               rate: false,
               ages: false,
               categories: false,
               formats: false,
               delivery: false,
               price: false,
               year: false,
               condition: false,
               available: false,
               buying: false,
               genres: false
          };
     }

     toggleAll(state) {
          _.forOwn(this.collapsed, (v, k) => {
               this.collapsed[k] = state;
          });
     }

     toggleArray(genre, array, atLeastOne) {
          const index = array.indexOf(genre);
          if (index >= 0) {
               if (atLeastOne && array.length === 1) return;
               array.splice(index, 1);
          } else {
               array.push(genre);
          }
     }

     clearFilters() {
          _.forOwn(this.selected, (value, key) => {
               if (_.isArray(value)) this.selected[key].splice(0);
               if (_.includes(_.keys(this.defaults), key)) _.extend(this.selected, _.cloneDeep(_.pick(this.defaults, [key])));
          });
     }
     
     showClearFilters() {
          return !_.isEqual(this.selected, this.cloned);
     }
}

export default angular.module('bookisApp.filter', [])
     .component('bookisFilterSidebar', {
          template: require('./bookis-filter-sidebar.html'),
          bindings: {
               selected: '=',
               allActions: '<',
               instant: '&',
               debounced: '&',
               showSelectedFilters: '='
          },
          controllerAs: 'vm',
          controller: BookisFilterController
     })
     .name;
