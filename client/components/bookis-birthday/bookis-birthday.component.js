'use strict';

import angular from 'angular';

export class BookisBirthdayController {
     bind;
     ml;
     dates = _.range(1, 32);
     years;

     /*@ngInject*/
     constructor(moment) {
          'ngInject';
          this.moment = moment;
          this.years = _.range(moment().year(), moment().year() - 130, -1);
          this.ml = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          this.date = this.date || [];
          this.$onInit = () => {
               if (!this.bind) return;
               let string = moment(this.bind).format('YYYY-MM-DD');
               this.date = string.split('-').map(Number);
               this.date[1] = this.ml[this.date[1] - 1];
          };
          this.change = (type, value) => {
               const index = type === 'year' ? 0 : type === 'month' ? 1 : 2;
               this.date[index] = value;
               const maxDaysInMonth = this.moment(_.initial(this.date).join('-'), 'YYYY-MMMM').daysInMonth();
               if (maxDaysInMonth < this.date[2]) this.date[2] = maxDaysInMonth;
               if (this.date[0] && this.date[1]) this.dates = _.range(1, maxDaysInMonth + 1);
               if (!(_.filter(this.date).length === 3)) return;
               let stringDate = _.values(this.date).toString().split(',').join('-');
               const m = this.moment(new Date(stringDate));
               this.bind = this.moment(m).utc().add(m.utcOffset(), 'm');
          };
     }
}

export default angular.module('bookisApp.bookisbirthday', [])
     .component('bookisBirthday', {
          template: require('./bookis-birthday.html'),
          require: {
               form: '^form'
          },
          bindings: {
               bind: '=',
               name: '@'
          },
          controllerAs: 'vm',
          controller: BookisBirthdayController
     })
     .name;
