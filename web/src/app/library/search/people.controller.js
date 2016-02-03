(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryPeopleSearchController', LibraryPeopleSearchController);

   /** @ngInject */
   function LibraryPeopleSearchController($stateParams, $state, $scope, $timeout, personRepository) {
      var vm = this;

      vm.people = [];
      vm.query = '';
      vm.currentId = null;
      vm.loading = true;
      vm.loadingTimeout = null;
      vm.showThrobber = false;
      vm.search = search;

      $scope.$on('$stateChangeSuccess', function (evt, state, params) {
         if (state.name === 'sda.library.search-people') {
            if (params.id) {
               vm.currentId = params.id
            }
         } else {
            vm.currentId = null;
         }
      });

      activate();

      function activate() {
         if ($state.is('sda.library.search-people')) {
            vm.query = $stateParams.query;
            vm.currentId = $stateParams.id;

            if (vm.query) {
               search();
            }
         }
      }

      function search() {
         $state.go('sda.library.search-people', { query: vm.query, id: vm.currentId });

         vm.people = personRepository.query({ syntheticName: vm.query }, onResultsLoaded);

         showThrobber();
         vm.loading = true;
      }

      function onResultsLoaded() {
         hideThrobber();
         vm.loading = false;

         if (!vm.currentId && vm.people.length > 0) {
            vm.currentId = vm.people[0].id;
            $state.go('sda.library.search-people', { query: vm.query, id: vm.currentId });
         }
      }

      function showThrobber() {
         hideThrobber();

         // prevent throbber "flash" on quick load
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
