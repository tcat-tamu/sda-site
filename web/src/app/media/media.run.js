(function () {
   'use strict';

   angular
      .module('sda.media')
      .run(runBlock);

   /** @ngInject */
   function runBlock($log) {
      $log.debug('runBlock end');
   }

})();
