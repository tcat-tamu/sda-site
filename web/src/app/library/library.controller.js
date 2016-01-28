(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryController', LibraryController);

   /** @ngInject */
   function LibraryController($state, $scope) {
      var vm = this;

      vm.defaultTab = null;
      vm.showBanner = true;

      vm.peopleQuery = '';
      vm.people = null;
      vm.searchPeople = searchPeople;

      vm.bookQuery = '';
      vm.books = null;
      vm.searchBooks = searchBooks;

      vm.keyBooks = [];

      activate();

      function activate() {
         $scope.$on('set:query:book', function (e, query) {
            vm.defaultTab = 'books';
            vm.bookQuery = query;
         });
         $scope.$on('set:query:people', function (e, query) {
            vm.defaultTab = 'people';
            vm.peopleQuery = query;
         });

         $scope.$on('sda-tabbed-sidebar:change:tab', function (e, newTab) {
            vm.defaultTab = newTab.id;
         });

         vm.keyBooks = [
            { author: 'David Hume', title: 'Philosophical Essays' },
            { author: 'Thomas Stackhouse', title: 'A Defence of the Christian Religion' },
            { author: 'William Paley', title: 'Horae Paulinae' },
            { author: 'Thomas Woolston', title: 'Six Discourses' },
            { author: 'Nathaniel Lardner', title: 'A Vindication of Three of our Blessed Saviour\'s Miracles' }
         ]
      }

      function searchPeople() {
         $state.go('sda.library.search-people', { query: vm.peopleQuery });
      }

      function searchBooks() {
         $state.go('sda.library.search-books', { query: vm.bookQuery });
      }
   }

})();
