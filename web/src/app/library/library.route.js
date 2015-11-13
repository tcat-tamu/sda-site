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
         })
         .state('home.search', {
            url: 'search/:query',
            templateUrl: 'app/library/main/search/search.html',
            controller: 'SearchController',
            controllerAs: 'vm'
         });

      $urlRouterProvider.otherwise('/');
   }

})();
