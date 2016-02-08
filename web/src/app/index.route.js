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
            abstract: true,
            template: '<div ui-view class="flex layout-column"></div>'
         })
         .state('sda.library.main', {
            url: '/library',
            templateUrl: 'app/library/library.html',
            controller: 'LibraryController',
            controllerAs: 'vm'
         })
         .state('sda.library.main.search-people', {
            url: '/search/people/:id?query',
            reloadOnSearch: false,
            templateUrl: 'app/library/people/person.html',
            controller: 'LibraryPersonController',
            controllerAs: 'vm'
         })
         .state('sda.library.main.search-books', {
            url: '/search/books/:id?query',
            reloadOnSearch: false,
            templateUrl: 'app/library/books/book.html',
            controller: 'LibraryBookController',
            controllerAs: 'vm'
         })
         .state('sda.library.main.person', {
            url: '/people/:id',
            templateUrl: 'app/library/people/person.html',
            controller: 'LibraryPersonController',
            controllerAs: 'vm'
         })
         .state('sda.library.main.book', {
            url: '/books/:id',
            templateUrl: 'app/library/books/book.html',
            controller: 'LibraryBookController',
            controllerAs: 'vm'
         })
         .state('sda.library.bookreader', {
            url: '/library/read/:workId/:copyId',
            templateUrl: 'app/library/bookreader/bookreader.html',
            controller: 'LibraryBookreaderController',
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
         .state('sda.reader.preview', {
            url: '/preview/:id',
            templateUrl: 'app/reader/preview/preview.html',
            controller: 'ReaderPreviewController',
            controllerAs: 'vm'
         })
         .state('sda.reader-article', {
            url: '/reader/articles/:id?scrollTo',
            templateUrl: 'app/reader/article/article.html',
            controller: 'ArticleController',
            controllerAs: 'vm'
         })

         // disable for release and demo
         // .state('sda.conference', {
         //    url: '/conferences',
         //    templateUrl: 'app/conferences/conferences.html',
         //    controller: 'ConferencesController',
         //    controllerAs: 'vm'
         // })
         // .state('sda.conference.show', {
         //    url: '/{id}',
         //    templateUrl: 'app/conferences/show/show.html',
         //    controller: 'ConferenceShowController',
         //    controllerAs: 'vm'
         // })

         .state('sda.teaching', {
            url: '/teaching',
            templateUrl: 'app/teaching/teaching.html',
            controller: 'TeachingController',
            controllerAs: 'vm'
         })

         .state('sda.about', {
            url: '/about',
            templateUrl: 'app/about/about.html',
            controller: 'AboutController',
            controllerAs: 'vm'
         })
      ;

      $urlRouterProvider.otherwise('/');
   }

})();
