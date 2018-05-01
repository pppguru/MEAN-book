'use strict';

export function user() {
     'ngInject';
     return userFilter;

     function userFilter(usr, onlyFirst) {
          if (!usr) return 'Unknown';
          return usr.corporateName ||usr.businessName || (onlyFirst ? usr.firstName : `${usr.firstName} ${usr.lastName}`);
     }
}
