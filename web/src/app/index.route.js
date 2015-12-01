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

         .state('sda', {
            abstract: true,
            templateUrl: 'app/layout.html'
         })


         .state('sda.library', {
            url: '/library',
            templateUrl: 'app/library/library.html',
            controller: 'LibraryController',
            controllerAs: 'vm'
         })
         .state('sda.library.search-people', {
            url: '/search/people/:query',
            templateUrl: 'app/library/search/people.html',
            controller: 'LibraryPeopleSearchController',
            controllerAs: 'vm'
         })
         .state('sda.library.search-books', {
            url: '/search/books/:query',
            templateUrl: 'app/library/search/books.html',
            controller: 'LibraryBooksSearchController',
            controllerAs: 'vm'
         })


         .state('sda.media', {
            url: '/media',
            templateUrl: 'app/media/media.html',
            controller: 'MediaController',
            controllerAs: 'vm'
         })
         .state('sda.media-item', {
            url: '/media/:id',
            templateUrl: 'app/media/item/item.html',
            controller: 'MediaItemController',
            controllerAs: 'vm'
         })


         .state('sda.reader', {
            url: '/reader',
            templateUrl: 'app/reader/reader.html',
            controller: 'ReaderController',
            controllerAs: 'vm'
         })
         .state('sda.reader.search', {
            url: '/search/:query',
            templateUrl: 'app/reader/search/search.html',
            controller: 'ReaderSearchController',
            controllerAs: 'vm'
         })
         .state('sda.reader-article', {
            url: '/reader/articles/:id?scrollTo',
            templateUrl: 'app/reader/article/article.html',
            controller: 'ArticleController',
            controllerAs: 'vm'
         })
      ;

      $urlRouterProvider.otherwise('/');
   }

})();
