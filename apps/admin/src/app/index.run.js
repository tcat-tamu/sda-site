(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .run(runBlock);

  var AUTH_PERSIST_KEY = 'sdaAuthCredentials';

  /** @ngInject */
  function runBlock($log, $window, trcAuth) {

    trcAuth.onLogin(function (creds) {
      $log.debug('logged in as', creds.accountId);
      $window.localStorage.setItem(AUTH_PERSIST_KEY, angular.toJson(creds));
    });

    trcAuth.onLogout(function () {
      $log.debug('logged out');
      $window.localStorage.removeItem(AUTH_PERSIST_KEY);
    });

    // attempt to load persisted authentication credentials
    var jsonCreds = $window.localStorage.getItem(AUTH_PERSIST_KEY);
    if (jsonCreds) {
      $log.debug('loading credentials from localStorage');
      var creds = JSON.parse(jsonCreds);
      creds.expires = new Date(creds.expires);
      trcAuth.setCredentials(creds);
    }

    if (!trcAuth.isAuthenticated()) {
      trcAuth.loginGuest();
    }

    $log.debug('runBlock end');
  }

})();
