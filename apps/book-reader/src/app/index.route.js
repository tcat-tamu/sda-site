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
        templateUrl: 'app/book-reader/book-reader.html',
        controller: 'BookReaderController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
