(function () {
   'use strict';

   angular
      .module('sda.media')
      .config(routeConfig);

   /** @ngInject */
   function routeConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('home', {
            url: '/',
            templateUrl: 'app/media/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
         })
         .state('item', {
            url: '/:id',
            templateUrl: 'app/media/item/item.html',
            controller: 'ItemController',
            controllerAs: 'vm'
         });

      $urlRouterProvider.otherwise('/');
   }

})();
