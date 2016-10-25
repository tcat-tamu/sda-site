(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
