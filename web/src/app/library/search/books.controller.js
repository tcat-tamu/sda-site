(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBooksSearchController', LibraryBooksSearchController);

   /** @ngInject */
   function LibraryBooksSearchController($stateParams, $state, $scope, workRepository) {
      var vm = this;

      vm.books = [];
      vm.query = '';
      vm.currentId = null;

      activate();

      function activate() {
         vm.query = $stateParams.query;
         vm.currentId = $stateParams.id;
         $scope.$emit('set:query:book', vm.query);
         vm.books = workRepository.query({ q: vm.query }, onResultsLoaded);
      }

      function onResultsLoaded() {
         if (!vm.currentId && vm.books.length > 0) {
            $state.go('sda.library.search-books', { query: vm.query, id: vm.books[0].id })
         }
      }
   }

})();
