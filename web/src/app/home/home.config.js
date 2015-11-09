(function () {
   'use strict';

   angular
      .module('sda.home')
      .config(config);

   /** @ngInject */
   function config($logProvider) {
      // Enable log
      $logProvider.debugEnabled(true);
   }

})();
