(function () {
  'use strict';

  angular
    .module('sda.concept-browser')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
