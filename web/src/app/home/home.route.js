(function () {
   'use strict';

   angular
      .module('sda.home')
      .config(routeConfig);

   /** @ngInject */
   function routeConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('home', {
            url: '/',
            templateUrl: 'app/home/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
         });

      $urlRouterProvider.otherwise('/');
   }

})();
