'use strict';

class TranslateController {
     translateService;
     visible;
     flags;
     localesDisplayNames;
     currentLocaleDisplayName;
     active;
     flag;
     /*@ngInject*/
     constructor(translateService, LOCALES, $window) {
          'ngInject';
          this.translateService = translateService;
          this.localesDisplayNames = translateService.getLocalesDisplayNames();
          this.currentLocaleDisplayName = LOCALES.locales[$window.localStorage.getItem('NG_TRANSLATE_LANG_KEY')];
          this.visible = this.localesDisplayNames && this.localesDisplayNames.length > 1;
          this.flags = {
               English: '/assets/images/en.png',
               Norwegian: '/assets/images/no.jpg'
          };
          translateService.setLocaleByDisplayName(this.currentLocaleDisplayName);
          this.updateFlag();
     }


     updateFlag(country = this.currentLocaleDisplayName) {
          this.active = country;
          this.flag = this.flags[country];
     }

     changeLanguage = locale => {
          this.translateService.setLocaleByDisplayName(locale);
          this.updateFlag(locale);
     };
}

export function translateComponent() {
     return {
          template: require('./translate.html'),
          controllerAs: 'vm',
          controller: TranslateController
     };
}
