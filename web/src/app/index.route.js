(function () {
   'use strict';

   angular
      .module('sda')
      .config(routerConfig);

   /** @ngInject */
   function routerConfig($stateProvider, $urlRouterProvider) {


      $stateProvider

         .state('home', {
            url: '/',
            templateUrl: 'app/home/home.html',
            controller: 'MainController',
            controllerAs: 'vm'
         })


         .state('library', {
            url: '/library',
            templateUrl: 'app/library/library.html',
            controller: 'LibraryController',
            controllerAs: 'vm'
         })
         .state('library.search', {
            url: 'search/:query',
            templateUrl: 'app/library/search/search.html',
            controller: 'LibrarySearchController',
            controllerAs: 'vm'
         })


         .state('media', {
            url: '/media',
            templateUrl: 'app/media/media.html',
            controller: 'MediaController',
            controllerAs: 'vm'
         })
         .state('media-item', {
            url: '/media/:id',
            templateUrl: 'app/media/item/item.html',
            controller: 'MediaItemController',
            controllerAs: 'vm'
         })


         .state('reader', {
            url: '/reader',
            templateUrl: 'app/reader/reader.html',
            controller: 'ReaderController',
            controllerAs: 'vm'
         })
         .state('reader.search', {
            url: 'search/:query',
            templateUrl: 'app/reader/search/search.html',
            controller: 'ReaderSearchController',
            controllerAs: 'vm'
         })
         .state('reader-article', {
            url: '/reader/articles/:id?scrollTo',
            templateUrl: 'app/reader/article/article.html',
            controller: 'ArticleController',
            controllerAs: 'vm'
         })
      ;

      $urlRouterProvider.otherwise('/');
   }

})();
