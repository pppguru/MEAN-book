'use strict';

export default function routes($stateProvider) {
     'ngInject';

     $stateProvider.state('main', {
          url: '/?openLogin?jwt?redirect',
          template: '<main></main>'
     });
}
