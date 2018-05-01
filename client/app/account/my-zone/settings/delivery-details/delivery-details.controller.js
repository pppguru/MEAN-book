'use strict';
// @flow

export default class DeliveryDetailsController {
     me;
     shippingDurations;
     map;
     userService;
     autoComplete;
     mapOptions = {
          scrollwheel: false
     };
     markerOptions = {
          draggable: false
     };
     isEqual = _.isEqual;
     omit = _.omit;
     toast;

     /*@ngInject*/
     constructor(me, appConfig, userService, toast) {
          this.me = _.cloneDeep(me);
          this.origin = _.cloneDeep(this.me);
          this.userService = userService;
          this.toast = toast;
          this.autoComplete = _.size(_.get(this, 'me.address.coordinates')) ? userService.generateFullAddress(this.me.address) : '';
          this.shippingDurations = appConfig.shippingDurations;
     }

     update(form, type) {
          if (!this.me.delivery.shipping.enabled && !this.me.delivery.meetup.enabled) {
               this.me.delivery = _.cloneDeep(this.origin.delivery);
               return this.toast.error('At least one delivery method needs to be checked.');
          }
          this.userService.updateCurrentUser(this, form, type);
     }

}
