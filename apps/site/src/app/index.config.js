(function () {
  'use strict';

  angular
    .module('sdaSite')
    .config(config);

  /** @ngInject */
  function config($logProvider, worksRepoProvider, peopleRepoProvider, trcSearchProvider, relnRepoProvider, seeAlsoRepoProvider, graphRepoProvider, articlesRepoProvider, sdaSitenavProvider, analyticsProvider, googleBooksApiProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    var BASE_URL = '/api/catalog';

    worksRepoProvider.url = BASE_URL + '/works';
    peopleRepoProvider.url = BASE_URL + '/people';
    relnRepoProvider.url = BASE_URL + '/relationships';
    articlesRepoProvider.url = BASE_URL + '/entries/articles';
    seeAlsoRepoProvider.url = BASE_URL + '/seealso';
    trcSearchProvider.url = BASE_URL + '/search';
    graphRepoProvider.url = BASE_URL + '/graph';

    googleBooksApiProvider.configure({ preventLoad: true });

    sdaSitenavProvider.url = '/assets/data/navigation.json';

    analyticsProvider.id = 'UA-87254463-1';
  }

})();
