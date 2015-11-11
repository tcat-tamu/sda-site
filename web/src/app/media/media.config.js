(function () {
   'use strict';

   angular
      .module('sda.media')
      .config(config);

   /** @ngInject */
   function config($logProvider) {
      // Enable log
      $logProvider.debugEnabled(true);
   }

})();
