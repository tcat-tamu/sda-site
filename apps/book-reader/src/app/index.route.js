(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('sda', {
        abstract: true,
        templateUrl: 'app/layout.html'
      })

      .state('sda.library.bookreader', {
        url: '/library/read/:workId/:copyId?editionId&volumeId',
        templateUrl: 'app/library/bookreader/bookreader.html',
        controller: 'LibraryBookreaderController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
