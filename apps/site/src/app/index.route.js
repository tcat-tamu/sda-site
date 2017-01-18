(function () {
  'use strict';

  angular
    .module('sdaSite')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('book-reader', {
        url: '/book-reader/:workId/:copyId?editionId&volumeId',
        templateUrl: 'app/book-reader/book-reader.html',
        controller: 'BookReaderController',
        controllerAs: 'vm',
        resolve: {
          copyRef: function ($stateParams, worksRepo) {
            'ngInject';
            var copyRef = worksRepo.getDigitalCopy($stateParams.copyId, $stateParams.workId, $stateParams.editionId, $stateParams.volumeId);
            return copyRef.$promise;
          },
          work: function ($stateParams, worksRepo) {
            'ngInject';
            var work = worksRepo.getWork($stateParams.workId);
            return work.$promise;
          }
        }
      })

      .state('concept-browser', {
        url: '/influence-map/:type',
        templateUrl: 'app/influence-map/concept-browser.html',
        controller: 'ConceptBrowserController',
        controllerAs: 'vm'
      })

      .state('library', {
        url: '/research',
        templateUrl: 'app/research/library.html',
        controller: 'LibraryController',
        controllerAs: 'vm'
      })

      .state('library.person', {
        url: '/people/:id',
        templateUrl: 'app/research/person/person.html',
        controller: 'PersonController',
        controllerAs: 'vm',
        resolve: {
          person: function ($stateParams, peopleRepo) {
            'ngInject';
            var person = peopleRepo.get($stateParams.id);
            return person.$promise;
          },
          refs: function ($stateParams, peopleRepo, refsRepoFactory) {
            'ngInject';
            var refsEndpoint = peopleRepo.getReferencesEndpoint($stateParams.id);
            var refsRepo = refsRepoFactory.getRepo(refsEndpoint);
            var refs = refsRepo.get();
            return refs.$promise;
          },
          relatedWorks: function ($stateParams, worksRepo) {
            'ngInject';
            var relatedWorks = worksRepo.searchByAuthor($stateParams.id);
            return relatedWorks.$promise.then(function (result) {
              return result.items;
            });
          }
        }
      })

      .state('library.book', {
        url: '/books/:id',
        templateUrl: 'app/research/book/book.html',
        controller: 'BookController',
        controllerAs: 'vm',
        resolve: {
          work: function ($stateParams, worksRepo) {
            'ngInject';
            var work = worksRepo.getWork($stateParams.id);
            return work.$promise;
          },
          refs: function ($stateParams, worksRepo, refsRepoFactory) {
            'ngInject';
            var refsEndpoint = worksRepo.getReferencesEndpoint($stateParams.id);
            var refsRepo = refsRepoFactory.getRepo(refsEndpoint);
            var refs = refsRepo.get();
            return refs.$promise;
          }
        }
      })

      .state('reader', {
        url: '/themes?id',
        templateUrl: 'app/themes/reader.html',
        controller: 'ReaderController',
        controllerAs: 'vm'
      })

      .state('reader.preview', {
        url: '/preview',
        templateUrl: 'app/themes/preview/preview.html',
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
        url: '/themes/article/:id',
        templateUrl: 'app/themes/article/article.html',
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
      })

      .state('vwise', {
        url: '/vwise',
        templateUrl: 'app/vwise/workspace.html',
        controller: 'WorkspaceController',
        controllerAs: 'vm'
      })

      .state('about', {
        url: '/about?id',
        templateUrl: 'app/about/about.html',
        controller: 'AboutController',
        controllerAs: 'vm',
        resolve: {
          page: function ($stateParams, articlesRepo) {
            if (!$stateParams.id) {
              return null;
            }

            var page = articlesRepo.get($stateParams.id);
            return page.$promise;
          }
        }
      });

    $urlRouterProvider.otherwise('/research');
  }

})();
