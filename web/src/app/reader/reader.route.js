(function () {
   'use strict';

   angular
      .module('sda.reader')
      .config(routeConfig);

   /** @ngInject */
   function routeConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('articles', {
            url: '/',
            templateUrl: 'app/reader/main/main.html',
            controller: 'MainController',
            controllerAs: 'vm'
         })
         .state('articles.search', {
            url: 'search/:query',
            views: {
               content: {
                  templateUrl: 'app/reader/search/search.html',
                  controller: 'SearchController',
                  controllerAs: 'vm'
               }
            }
         })
         .state('articles.show', {
            url: 'articles/:id',
            views: {
               sidebar: {
                  templateUrl: 'app/reader/show/toc.html',
                  controller: 'ArticleTocController',
                  controllerAs: 'vm'
               },
               content: {
                  templateUrl: 'app/reader/show/show.html',
                  controller: 'ArticleShowController',
                  controllerAs: 'vm'
               }
            }
         });

      $urlRouterProvider.otherwise('/');
   }

})();
