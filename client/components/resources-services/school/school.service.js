'use strict';

export function SchoolService(SchoolAPI, Util) {
     'ngInject';
     const schools = [];
     return {
          getData: () => schools,
          getSchools
     };

     function getSchools() {
          return SchoolAPI.query().$promise
               .then(s => {
                    Util.bindArray(schools, s);
                    return schools;
               })
               .catch(err => console.log(err));
     }
}
