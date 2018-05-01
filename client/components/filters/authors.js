'use strict';

export function authors() {
     'ngInject';
     return authorsFilter;

     function authorsFilter(value) {
          if (_.isEmpty(_.compact(value)) || !value) return 'Unknown';
          return _.map(value, el => {
               if (el.corporateName) return el.corporateName;
               return `${el.firstName} ${el.lastName}`;
          }).join(', ');
     }
}

export function mainAuthor() {
     'ngInject';
     return mainAuthorFilter;

     function mainAuthorFilter(value) {
          if (_.isEmpty(_.compact(value)) || !value) return 'Unknown';

          let el = value[0];
          if (el) {
              if (el.corporateName) return el.corporateName;
               return `${el.firstName} ${el.lastName}`;
          }
     }
}
