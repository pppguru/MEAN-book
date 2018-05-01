'use strict';
// @flow

export default class AdvancedController {
     selected;
     debouncedFiltering: Function;
     instantFiltering: Function;
     algoliaService;
     Auth;
     stats;
     hits;
     me;
     breakpoints = [
          {
               breakpoint: 1200,
               settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
               }
          },
          {
               breakpoint: 1000,
               settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
               }
          },
          {
               breakpoint: 800,
               settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
               }
          },
          {
               breakpoint: 600,
               settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
               }
          }
     ];
     slickConfig = {
          infinite: true,
          draggable: true,
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 0,
          reloaded: false
     };
     /*@ngInject*/
     constructor($stateParams, algoliaService, moment, Auth) {
          this.stats = {};
          this.hits = [];
          this.showSelectedFilters = false;
          this.me = Auth.getCurrentUserSync();//eslint-disable-line no-sync
          this.selected = {
               query: $stateParams.query || '',
               genres: _.compact($stateParams.genres) || [],
               formats: [],
               year: {
                    min: $stateParams.year ? $stateParams.year : 1900,
                    max: $stateParams.year ? $stateParams.year : moment().year()
               },
               rate: {
                    min: 1,
                    max: 5
               },
               available: {
                    checked: false
               }
          };

          this.algoliaService = algoliaService;
          instantFilteringFn.apply(this);//eslint-disable-line prefer-reflect
          this.debouncedFiltering = _.debounce(instantFilteringFn, 1000);//used by sliders and input
          this.instantFiltering = instantFilteringFn;//used by checkboxes
     }

}
function instantFilteringFn() {
     this.algoliaService.filterBooks(this.selected)
          .then(data => {
               _.extend(this.stats, _.pick(data, ['processingTimeMS', 'nbHits']));
               this.hits.splice(0);
               this.hits.push(...data.hits);
               this.slickConfig.reloaded = !this.slickConfig.reloaded;
          });
}
