(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBooksSearchController', LibraryBooksSearchController);

   /** @ngInject */
   function LibraryBooksSearchController($stateParams, $state, $scope, $timeout, workRepository) {
      var vm = this;

      vm.books = [];
      vm.query = '';
      vm.currentId = null;
      vm.loading = true;
      vm.showThrobber = false;
      vm.throbberTimeout = null;

      activate();

      function activate() {
         vm.query = $stateParams.query;
         vm.currentId = $stateParams.id;
         $scope.$emit('set:query:book', vm.query);
         vm.books = workRepository.query({ q: vm.query }, onResultsLoaded);

         // prevent "flash" on quick load
         vm.loadingTimeout = $timeout(function () {
            vm.showThrobber = true;
         }, 250);
      }

      function onResultsLoaded() {
         if (vm.loadingTimeout) {
            $timeout.cancel(vm.loadingTimeout);
            vm.loadingTimeout = null;
         }

         vm.showThrobber = false;
         vm.loading = false;

         if (!vm.currentId && vm.books.length > 0) {
            $state.go('sda.library.search-books', { query: vm.query, id: vm.books[0].id })
         }
      }
   }

})();
