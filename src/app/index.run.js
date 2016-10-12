(function () {
   'use strict';

   angular
      .module('sda')
      .run(runBlock);

   /** @ngInject */
   function runBlock($log) {
      $log.debug('runBlock end');
   }

})();
