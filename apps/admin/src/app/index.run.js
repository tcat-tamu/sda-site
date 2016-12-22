(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, trcAuth) {
    if (!trcAuth.isAuthenticated()) {
      trcAuth.loginGuest();
    }

    $log.debug('runBlock end');
  }

})();
