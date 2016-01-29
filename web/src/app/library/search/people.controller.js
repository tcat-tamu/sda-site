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

      activate();

      function activate() {
         vm.query = $stateParams.query;
         vm.currentId = $stateParams.id;
         $scope.$emit('set:query:people', vm.query);
         vm.people = personRepository.query({ syntheticName: vm.query }, onResultsLoaded);

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

         if (!vm.currentId && vm.people.length > 0) {
            $state.go('sda.library.search-people', { query: vm.query, id: vm.people[0].id })
         }
      }
   }

})();
