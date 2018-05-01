'use strict';

export default class MyAccountController {
     me;
     origin;
     isEqual:Function;
     userService;
     Modal;
     genders;
     image = {
          base64: '',
          uploading: false
     };
     mapOptions = {
          scrollwheel: false
     };

     /*@ngInject*/
     constructor(me, userService, Modal, appConfig) {
          this.me = _.cloneDeep(me);
          this.origin = _.cloneDeep(me);
          this.userService = userService;
          this.isEqual = _.isEqual;
          this.Modal = Modal;
          this.genders = appConfig.genders;
     }

     update(form) {
          this.userService.updateCurrentUser(this, form, 'profile');
     }

     upload(image) {
          this.userService.updateCurrentUserProfileImage(image, this);
     }

     openCropModal(file) {
          this.Modal.crop(file)
               .then(img => this.upload(_.extend(this.image, {base64: img.cropped})))
               .catch(err => console.log('Err :', err));
     }

     openTakeImageModal() {
          this.Modal.takePhoto()
               .then(({img}) => this.openCropModal(img));
     }
     
     deactivate() {
          const note = 'By deactivating your account all your pending requests will be canceled and all your books will be removed from sale';
          this.Modal.confirm('Deactivate', 'your account', note)
               .then(this.userService.deactivateAccount);
     }

}
