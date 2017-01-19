(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .run(runBlock);

  /** @ngInject */
  function runBlock(trcAuth) {
    if (!trcAuth.isAuthenticated()) {
      trcAuth.loginGuest();
    }
  }

})();
