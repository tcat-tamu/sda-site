(function () {
   'use strict';

   angular
      .module('sda')
      .config(config);

   /** @ngInject */
   function config($logProvider, toastrConfig, categorizationRepoProvider, citeprocProvider) {
      // Enable log
      $logProvider.debugEnabled(true);

      angular.extend(toastrConfig, {
         positionClass: 'toast-bottom-right',
         progressBar: true,
         timeOut: 3000
      });

      categorizationRepoProvider.url = '/api/catalog/categorizations';

      addLocale('en-US');
      addStyle('modern-language-association');

      function addLocale(localeId) {
         citeprocProvider.addLocale(localeId, supplier);

         /** @ngInject */
         function supplier($http) {
            return $http.get('assets/csl/locales/locales-' + localeId + '.xml').then(function (res) {
               return res.data;
            });
         }
      }

      function addStyle(styleId) {
         citeprocProvider.addStyle(styleId, supplier);

         /** @ngInject */
         function supplier($http) {
            return $http.get('assets/csl/styles/' + styleId + '.csl').then(function (res) {
               return res.data;
            });
         }
      }
   }

})();
