(function () {
   'use strict';

   angular
      .module('sda.reader')
      .config(routeConfig);

   /** @ngInject */
   function routeConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('home', {
            url: '/',
            templateUrl: 'app/reader/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
         })
         .state('home.search', {
            url: 'search/:query',
            templateUrl: 'app/reader/main/search/search.html',
            controller: 'SearchController',
            controllerAs: 'vm'
         });

      $urlRouterProvider.otherwise('/');
   }

})();
