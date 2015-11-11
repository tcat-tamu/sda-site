(function () {
   'use strict';

   angular
      .module('sda.library')
      .config(config);

   /** @ngInject */
   function config($logProvider) {
      // Enable log
      $logProvider.debugEnabled(true);
   }

})();
