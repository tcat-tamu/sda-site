(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider,
                  tasksRepoProvider,
                  worksRepoProvider,
                  peopleRepoProvider,
                  articlesRepoProvider,
                  relnRepoProvider,
                  categorizationServiceProvider,
                  seeAlsoRepoProvider,
                  trcSearchProvider,
                  trcAuthProvider,
                  trcAuthInterceptorProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // API endpoints
    var API_PREFIX = '/api/catalog';

    tasksRepoProvider.url = API_PREFIX + '/v1/tasks';
    worksRepoProvider.url = API_PREFIX + '/works';
    peopleRepoProvider.url = API_PREFIX + '/people';
    articlesRepoProvider.url = API_PREFIX + '/entries/articles';
    relnRepoProvider.url = API_PREFIX + '/relationships';
    categorizationServiceProvider.url = API_PREFIX + '/categorizations';
    seeAlsoRepoProvider.url = API_PREFIX + '/seealso';
    trcSearchProvider.url = API_PREFIX + '/search';

    // authentication
    trcAuthProvider.loginUrl = API_PREFIX + '/accounts/auth';
    trcAuthProvider.loginGuestUrl = API_PREFIX + '/accounts/authguest';
    trcAuthInterceptorProvider.url = new RegExp('^' + API_PREFIX, 'i');
    $httpProvider.interceptors.push('trcAuthInterceptor');
  }

})();
