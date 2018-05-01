'use strict';

export function CourseService(CourseAPI, Util) {
     'ngInject';
     const courses = [];
     return {
          getData: () => courses,
          getCourses
     };

     function getCourses(query) {
          return CourseAPI.query(query).$promise
               .then(c => {
                    Util.bindArray(courses, c);
                    return courses;
               })
               .catch(err => console.log(err));
     }
}
