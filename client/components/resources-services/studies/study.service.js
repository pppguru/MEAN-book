'use strict';

export function StudyService(StudyAPI, Util) {
     'ngInject';
     const studies = [];
     return {
          getData: () => studies,
          getStudies
     };

     function getStudies(school) {
          return StudyAPI.query({school}).$promise
               .then(s => {
                    Util.bindArray(studies, s);
                    return studies;
               })
               .catch(err => console.log(err));
     }
}
