'use strict';

import angular from 'angular';
import {translateService} from './translate.service';
import {translateComponent} from './translate.component';

export default angular.module('bookisApp.translate', ['pascalprecht.translate', 'tmh.dynamicLocale'])
     .service('translateService', translateService)
     .component('translateComponent', translateComponent())
     .config(translateConfig)
     .config(translateProvider)
     .config(dynamicProvider)
     .constant('LOCALES', {
          locales: {
               en_US: 'English', //eslint-disable-line camelcase
               no_NO: 'Norwegian' //eslint-disable-line camelcase
          },
          preferredLocale: 'en_US'
     })
     .name;

function translateConfig($translateProvider) {
     'ngInject';
     $translateProvider.useMissingTranslationHandlerLog();
}

function dynamicProvider(tmhDynamicLocaleProvider) {
     'ngInject';
     tmhDynamicLocaleProvider.localeLocationPattern('components/translate/i18n/angular-locale_{{locale}}.js');
}

function translateProvider($translateProvider) {
     'ngInject';
     $translateProvider.useSanitizeValueStrategy('escaped');
     $translateProvider.useStaticFilesLoader({
          prefix: 'components/translate/resources/locale-',
          suffix: '.json'
     });
     $translateProvider.preferredLanguage('en_US');
     $translateProvider.useLocalStorage();
}
