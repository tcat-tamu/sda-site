(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('vwise', {
        url: '/',
        templateUrl: 'app/vwise/workspace.html',
        controller: 'WorkspaceController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
