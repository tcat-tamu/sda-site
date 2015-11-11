(function () {
   'use strict';

   angular
      .module('sda.library')
      .run(runBlock);

   /** @ngInject */
   function runBlock($log) {
      $log.debug('runBlock end');
   }

})();
