(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
