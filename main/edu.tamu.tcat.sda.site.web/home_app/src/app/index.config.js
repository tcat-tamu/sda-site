(function () {
   'use strict';

   angular
      .module('sda.site')
      .config(config);

   /** @ngInject */
   function config($logProvider) {
      // Enable log
      $logProvider.debugEnabled(true);
   }

})();
