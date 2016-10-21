(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
