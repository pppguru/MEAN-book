'use strict';

export function scrollGlue($timeout) {
     'ngInject';
     return {
          priority: 1,
          restrict: 'A',
          bindToController: true,
          link
     };
     function link(scope, $el) {
          let el = $el[0];
          let activated = true;
          let isAttached = e => e.scrollTop + e.clientHeight + 1 >= e.scrollHeight;
          let onScroll = () => {
               activated = isAttached(el);
          };

          scope.$watch(scrollIfGlued);
          $timeout(scrollIfGlued, 0, false);

          $el.bind('scroll', onScroll);
          // Remove listeners on directive destroy
          $el.on('$destroy', () => $el.unbind('scroll', onScroll));

          function scrollIfGlued() {
               if (activated && !isAttached(el)) {
                    el.scrollTop = el.scrollHeight;
               }
          }
     }
}
