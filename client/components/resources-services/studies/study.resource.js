'use strict';

export function StudyResource($resource) {
     'ngInject';

     return $resource('/api/schools/:school/studies/:id/:controller', {
          id: '@_id', school: '@school', controller: '@controller'
     }, {
          updated: {
               method: 'PUT'
          }
     });
}
