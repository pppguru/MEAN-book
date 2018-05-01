'use strict';
// @flow

export default class KidsController {
     selected;
     ages;
     percentage;
     /*@ngInject*/
     constructor(appConfig, bookService) {
          this.ages = appConfig.books.ages;
          bookService.getKidsPopular();
          bookService.getKidsRecommended();
          this.recommended = bookService.getData('kidsRecommended');
          this.popular = bookService.getData('kidsPopular');
          this.selected = {
               ages: [],
               genres: [],
               categories: []
          };
          this.percentage = 33;
     }
}
