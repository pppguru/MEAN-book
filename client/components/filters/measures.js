'use strict';

export function measures() {
     'ngInject';
     return measuresFilter;

     function measuresFilter(value) {
          if (!_.sum(_.values(value))) return 'N/A';
          return `${value.thickness} x ${value.height} x ${value.weight} mm`;
     }
}
