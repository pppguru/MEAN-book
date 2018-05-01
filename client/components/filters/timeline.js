'use strict';

export function timeline(moment) {
     'ngInject';
     return timelineFilter;

     function timelineFilter(value) {
          const isToday = moment().diff(moment(value), 'days') < 1;
          return isToday ? `Today ${moment(value).format('H:mm')}` : moment(value).format('DD MMM YYYY HH:mm');
     }
}
