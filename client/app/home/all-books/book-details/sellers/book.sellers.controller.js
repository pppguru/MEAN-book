'use strict';
// @flow

export default class BookSellersController {
     selected;
     /*@ngInject*/
     constructor() {
          this.selected = {
               conditions: [],
               formats: ['paperback', 'hardcover'],
               price: {
                    min: 0,
                    max: 1000
               },
               delivery: ['shipping', 'meetup']
          };
     }
}
