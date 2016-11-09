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
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
