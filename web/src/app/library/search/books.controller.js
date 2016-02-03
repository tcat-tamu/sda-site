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
      vm.loadingTimeout = null;
      vm.showThrobber = false;
      vm.search = search;

      $scope.$on('$stateChangeSuccess', function (evt, state, params) {
         if (state.name === 'sda.library.search-books') {
            if (params.id) {
               vm.currentId = params.id
            }
         } else {
            vm.currentId = null;
         }
      });

      activate();


      function activate() {
         if ($state.is('sda.library.search-books')) {
            vm.query = $stateParams.query;
            vm.currentId = $stateParams.id;

            if (vm.query) {
               search();
            }
         }
      }

      function search() {
         $state.go('sda.library.search-books', { query: vm.query, id: vm.currentId });

         vm.books = workRepository.query({ q: vm.query }, onResultsLoaded);

         showThrobber();
         vm.loading = true;
      }

      function onResultsLoaded() {
         hideThrobber();
         vm.loading = false;

         if (!vm.currentId && vm.books.length > 0) {
            vm.currentId = vm.books[0].id;
            $state.go('sda.library.search-books', { query: vm.query, id: vm.currentId });
         }
      }

      function showThrobber() {
         hideThrobber();

         // prevent "flash" on quick load
         vm.loadingTimeout = $timeout(function () {
            vm.showThrobber = true;
            vm.loadingTimeout = null;
         }, 250);
      }

      function hideThrobber() {
         if (vm.loadingTimeout) {
            $timeout.cancel(vm.loadingTimeout);
            vm.loadingTimeout = null;
         }

         vm.showThrobber = false;
      }
   }

})();
