'use strict';

export function address() {
     'ngInject';
     return addressFilter;

     function addressFilter(user) {
          return user.address.coordinates[0] ? `${user.address.city}, ${user.address.streetAddress}` : 'Location not available';
     }
}
