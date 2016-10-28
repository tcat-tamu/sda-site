(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
