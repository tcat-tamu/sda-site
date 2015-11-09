(function () {
   'use strict';

   angular
      .module('sda.home')
      .run(runBlock);

   /** @ngInject */
   function runBlock($log) {
      $log.debug('runBlock end');
   }

})();
