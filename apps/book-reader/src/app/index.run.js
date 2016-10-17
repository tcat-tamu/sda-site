(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
