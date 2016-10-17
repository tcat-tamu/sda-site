(function () {
  'use strict';

  angular
    .module('sdaReader')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('sda', {
        abstract: true,
        templateUrl: 'app/layout.html'
      })

      .state('sda.reader.main', {
        url: '/',
        templateUrl: 'app/reader/reader.html',
        controller: 'ReaderController',
        controllerAs: 'vm'
      })
      .state('sda.reader.main.search', {
        url: '/search/:query',
        templateUrl: 'app/reader/search/search.html',
        controller: 'ReaderSearchController',
        controllerAs: 'vm'
      })
      .state('sda.reader.main.preview', {
        url: '/preview/:id',
        templateUrl: 'app/reader/preview/preview.html',
        controller: 'ReaderPreviewController',
        controllerAs: 'vm'
      })
      .state('sda.reader.article', {
        url: '/reader/articles/:id/:type?scrollTo',
        templateUrl: 'app/reader/article/article.html',
        controller: 'ArticleController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
