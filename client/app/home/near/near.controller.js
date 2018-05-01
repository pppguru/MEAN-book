'use strict';

export default class NearController {
     map;
     markers;
     users;
     center;
     /*@ngInject*/
     constructor(mapService, Auth, userService) {
          this.getMarker = id => this.markers[_.findIndex(this.markers, {id})];
          this.center = {};
          this.mapOptions = mapService.getMapOptions();
          mapService.getMap()
               .then(map => this.map = map)
               .then(userService.getNearUsers)
               .then(users => {
                    this.users = users;
                    this.markers = mapService.generateMarkers(this.users);
               });
     }

     centerMap([long, lat]) {
          this.map.center.latitude = lat;
          this.map.center.longitude = long;
     }
}
