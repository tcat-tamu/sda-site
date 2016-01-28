(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryPeopleSearchController', LibraryPeopleSearchController);

   /** @ngInject */
   function LibraryPeopleSearchController($stateParams, $state, $scope, personRepository) {
      var vm = this;

      vm.people = [];
      vm.query = '';
      vm.currentId = null;

      activate();

      function activate() {
         vm.query = $stateParams.query;
         vm.currentId = $stateParams.id;
         $scope.$emit('set:query:people', vm.query);
         vm.people = personRepository.query({ syntheticName: vm.query }, onResultsLoaded);
      }

      function onResultsLoaded() {
         if (!vm.currentId && vm.people.length > 0) {
            $state.go('sda.library.search-people', { query: vm.query, id: vm.people[0].id })
         }
      }
   }

})();
