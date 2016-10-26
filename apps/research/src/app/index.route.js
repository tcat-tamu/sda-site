(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('library', {
        url: '/',
        templateUrl: 'app/library/library.html',
        controller: 'LibraryController',
        controllerAs: 'vm'
      })

      .state('library.person', {
        url: 'people/:id',
        templateUrl: 'app/person/person.html',
        controller: 'PersonController',
        controllerAs: 'vm',
        resolve: {
          person: function ($stateParams, peopleRepo) {
            var person = peopleRepo.get($stateParams.id);
            return person.$promise;
          },
          relatedWorks: function ($stateParams, worksRepo) {
            var relatedWorks = worksRepo.searchByAuthor($stateParams.id);
            return relatedWorks.$promise.then(function (result) {
              return result.items;
            });
          }
        }
      })

      .state('library.book', {
        url: 'books/:id',
        templateUrl: 'app/book/book.html',
        controller: 'BookController',
        controllerAs: 'vm',
        resolve: {
          work: function ($stateParams, worksRepo) {
            var work = worksRepo.get($stateParams.id);
            return work.$promise;
          },
          refs: function ($stateParams, worksRepo, refsRepoFactory) {
            var refsEndpoint = worksRepo.getReferencesEndpoint($stateParams.id);
            var refsRepo = refsRepoFactory.getRepo(refsEndpoint);
            var refs = refsRepo.get();
            return refs.$promise;
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
