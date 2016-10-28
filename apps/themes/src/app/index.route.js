(function () {
  'use strict';

  angular
    .module('sdaReader')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('reader', {
        url: '/',
        templateUrl: 'app/reader/reader.html',
        controller: 'ReaderController',
        controllerAs: 'vm'
      })

      .state('reader.preview', {
        url: 'preview/:id',
        templateUrl: 'app/preview/preview.html',
        controller: 'PreviewController',
        controllerAs: 'vm',
        resolve: {
          article: function ($stateParams, articlesRepo) {
            var article = articlesRepo.get($stateParams.id);
            return article.$promise;
          }
        }
      })

      .state('article', {
        url: '/article/:id',
        templateUrl: 'app/article/article.html',
        controller: 'ArticleController',
        controllerAs: 'vm',
        resolve: {
          article: function ($stateParams, articlesRepo) {
            var article = articlesRepo.get($stateParams.id);
            return article.$promise;
          },
          references: function ($stateParams, articlesRepo, refsRepoFactory) {
            var refsEndpoint = articlesRepo.getReferencesEndpoint($stateParams.id);
            var refsRepo = refsRepoFactory.getRepo(refsEndpoint);
            return refsRepo.get();
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
