(function () {
   'use strict';

   angular
      .module('sda.reader')
      .config(config);

   /** @ngInject */
   function config($logProvider) {
      // Enable log
      $logProvider.debugEnabled(true);
   }

})();
