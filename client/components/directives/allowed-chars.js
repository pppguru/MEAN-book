'use strict';

export function allowedChars() {
     'ngInject';
     return {
          link,
          require: 'ngModel',
          restrict: 'EA'
     };

     function link(scope, element, attrs, ngModel) {
          ngModel.$parsers.push(val => {
               if (_.isUndefined(val)) return;
               let regex = new RegExp(attrs.allowedChars);
               let replaced = _.replace(val, regex, '');
               if (!_.eq(val, replaced)) {
                    ngModel.$setViewValue(replaced);
                    ngModel.$render();
               }
               return replaced;
          });
     }
}
