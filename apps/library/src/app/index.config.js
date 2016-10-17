(function () {
   'use strict';

   angular
      .module('sda')
      .config(config);

   /** @ngInject */
   function config($logProvider, toastrConfig, categorizationRepoProvider, articleRepoProvider, citeprocProvider) {
      // Enable log
      $logProvider.debugEnabled(true);

      angular.extend(toastrConfig, {
         positionClass: 'toast-bottom-right',
         progressBar: true,
         timeOut: 3000
      });

      categorizationRepoProvider.url = '/api/catalog/categorizations';
      articleRepoProvider.url = '/api/catalog/entries/articles';

      var CSL_LOCALES = {
         'en-US': 'en-US'
      };

      var CSL_STYLES = {
         mla: 'modern-language-association',
         chicago: 'chicago-author-date'
      };

      // helpers

      angular.forEach(CSL_LOCALES, addLocale);
      angular.forEach(CSL_STYLES, addStyle);

      function addLocale(filename, localeId) {
         citeprocProvider.addLocale(localeId, supplier);

         /** @ngInject */
         function supplier($http) {
            return $http.get('assets/csl/locales/locales-' + filename + '.xml').then(function (res) {
               return res.data;
            });
         }
      }

      function addStyle(filename, styleId) {
         citeprocProvider.addStyle(styleId, supplier);

         /** @ngInject */
         function supplier($http) {
            return $http.get('assets/csl/styles/' + filename + '.csl').then(function (res) {
               return res.data;
            });
         }
      }
   }

})();
