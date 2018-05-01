'use strict';

export function translateService($translate, LOCALES, $rootScope, tmhDynamicLocale) {
     'ngInject';
     let localesObj = LOCALES.locales;

     let _LOCALES = Object.keys(localesObj);
     if (!_LOCALES || _LOCALES.length === 0) {
          console.error('There are no _LOCALES provided');
     }
     let _LOCALES_DISPLAY_NAMES = [];
     _LOCALES.forEach(locale => {
          _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
     });

     let currentLocale = $translate.proposedLanguage();
     let checkLocaleIsValid = locale => _LOCALES.indexOf(locale) !== -1;
     let setLocale = locale => {
          if (!checkLocaleIsValid(locale)) {
               return console.error(`Locale name "${locale}" is invalid`);
          }
          currentLocale = locale;
          $translate.use(locale);
     };

     $rootScope.$on('$translateChangeSuccess', (event, data) => {
          let language = data.language.toLowerCase().replace(/_/g, '-');
          document.documentElement.setAttribute('lang', language);
          tmhDynamicLocale.set(language);
     });

     return {
          getLocaleDisplayName: () => localesObj[currentLocale],
          setLocaleByDisplayName: localeDisplayName => setLocale(_LOCALES[_LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName)]),
          getLocalesDisplayNames: () => _LOCALES_DISPLAY_NAMES
     };
}
