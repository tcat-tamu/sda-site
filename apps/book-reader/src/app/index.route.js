(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/layout.html'
      })
      .state('read', {
        url: '/:workId/:copyId?editionId&volumeId',
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
          },
          relns: function ($stateParams, relnRepo, worksRepo) {
            'ngInject';
            var currentUri = 'works/' + $stateParams.workId;
            var relns = relnRepo.search(currentUri);
            return relns.$promise.then(function () {
              var normRelns = relnRepo.normalizeRelationships(relns, currentUri, worksRepo);
              return normRelns.$promise;
            }).catch(function () {
              return [];
            });
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
