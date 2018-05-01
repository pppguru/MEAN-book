'use strict';

export function MapService(uiGmapGoogleMapApi, Auth, $timeout, userService) {
     'ngInject';
     let map = {};
     const me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
     return {
          getMap: () => uiGmapGoogleMapApi.then(() => {
               google.maps.event.addDomListener(window, 'resize', resizeHandler);
               _.extend(map, {
                    center: {
                         latitude: 65.367335,
                         longitude: 13.497279
                    },
                    window: {
                         model: {},
                         show: false,
                         options: {
                              pixelOffset: {
                                   width: -1,
                                   height: -50
                              }
                         }
                    },
                    events: {
                         click: mapClickHandler
                    },
                    markersEvents: {
                         click: markerClickHandler
                    },
                    control: {},
                    zoom: me()._id ? 14 : 5
               });
               return map;
          }),
          getMapOptions: () => ({
               mapTypeControl: false,
               scrollwheel: false
          }),
          generateMarkers
     };

     function generateMarkers(users) {
          return _.map(users, user => ({
               latitude: user.address.coordinates[1],
               longitude: user.address.coordinates[0],
               user,
               icon: {
                    url: user.imageUrl || '/assets/images/avatar.png',
                    scaledSize: new google.maps.Size(50, 50),
                    optimized: false
               },
               options: {
                    animation: google.maps.Animation.DROP,
                    labelClass: 'marker-label'
               },
               title: user.firstName,
               id: user._id
          }));
     }

     function resizeHandler() {
          const mapRef = map.control.getGMap();
          const center = mapRef.getCenter();
          google.maps.event.trigger(mapRef, 'resize');
          mapRef.setCenter(center);
     }

     function mapClickHandler() {
          $timeout(() => {
               map.window.hideWindow();
               map.window.show = false;
               map.window.pinned = '';
          })
     }

     function markerClickHandler(marker, eventName, model) {
          userService.getUserPublicBookshelf({_id: model.id}).then(bookshelf => {
               model.user.bookshelf = bookshelf;
          });
          userService.getUserSales({_id: model.id}).then(sales => {
               model.user.sales = sales;
          });
          map.window.model = model;
          map.window.pinned = model.id;
          map.window.show = true;
     }
}
