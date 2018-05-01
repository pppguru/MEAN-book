'use strict';

import angular from 'angular';

export default angular.module('directives.autocomplete', [])
     .directive('googleplace', googleplace)
     .name;

function googleplace(uiGmapGoogleMapApi) {
     'ngInject';
     return {
          require: 'ngModel',
          scope: {
               address: '=',
               center: '='
          },
          link(scope, element, attrs, model) {
               uiGmapGoogleMapApi.then(() => {
                    var options = {
                         types: [],
                         componentRestrictions: {}
                    };
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(scope.gPlace, 'place_changed', () => {
                         scope.$apply(() => {
                              fillAddressData(scope.gPlace.getPlace(), scope.address, scope.center);
                              // model.$setViewValue(element.val());
                         });
                    });
               });
          }
     };
}

function fillAddressData(place, address, center) {
     for (let i = 0; i < place.address_components.length; i++) {
          let addressType = place.address_components[i].types[0];
          /*eslint-disable */
          switch (addressType) {
               case 'locality': address.city = place.address_components[i].long_name;
                    break;
               case 'route': address.streetAddress = place.address_components[i].long_name;
                    break;
               case 'street_number': address.streetNumeric = place.address_components[i].long_name;
                    break;
               case 'country': address.country = place.address_components[i].long_name;
                    break;
               case 'administrative_area_level_1': address.state = place.address_components[i].short_name;
                    break;
               case 'postal_code': address.zip = (place.address_components[i].short_name);
                    break;
               default:
                    break;
               /*eslint-enable */
          }
     }
     address.coordinates = [place.geometry.location.lng(), place.geometry.location.lat()];
     if (center.longitude) center.longitude = place.geometry.location.lng();
     if (center.latitude)  center.latitude = place.geometry.location.lat();
}
