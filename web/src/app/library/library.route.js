(function () {
   'use strict';

   angular
      .module('sda.library')
      .config(routeConfig);

   /** @ngInject */
   function routeConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('home', {
            url: '/',
            templateUrl: 'app/library/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
         });

      $urlRouterProvider.otherwise('/');
   }

})();
