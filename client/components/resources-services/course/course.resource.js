'use strict';

export function CourseResource($resource) {
     'ngInject';

     return $resource('/api/schools/:school/studies/:study/courses/:id/:controller', {
          id: '@_id', school: '@school', study: '@study', controller: '@controller'
     }, {
          updated: {
               method: 'PUT'
          }
     });
}
