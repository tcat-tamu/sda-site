(function () {
   'use strict';

   angular
      .module('sda')
      .run(runBlock);

   /** @ngInject */
   function runBlock(cslBuilder, $log) {

      // configure CSL engine
      cslBuilder
         .addLocale('en-US', 'assets/csl/locales/locales-en-US.xml')
         .addStyle('mla', 'assets/csl/styles/modern-language-association.csl');

      $log.debug('runBlock end');
   }

})();
