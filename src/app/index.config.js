(function () {
   'use strict';

   angular
      .module('sda')
      .config(config);

   /** @ngInject */
   function config($logProvider, toastrConfig) {
      // Enable log
      $logProvider.debugEnabled(true);

      angular.extend(toastrConfig, {
         positionClass: 'toast-bottom-right',
         progressBar: true,
         timeOut: 3000
      });
   }

})();
