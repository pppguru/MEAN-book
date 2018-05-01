'use strict';

export function MessageResource($resource) {
     'ngInject';

     return $resource('/api/messages/:id/:controller', {
          id: '@_id'
     }, {});
}
