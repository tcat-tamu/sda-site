(function () {
   'use strict';

   angular
      .module('sda.site')
      .run(runBlock);

   /** @ngInject */
   function runBlock($log) {
      $log.debug('runBlock end');
   }

})();
