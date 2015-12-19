(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryPeopleSearchController', LibraryPeopleSearchController);

   /** @ngInject */
   function LibraryPeopleSearchController($stateParams, $scope, personRepository) {
      var vm = this;

      vm.people = [];

      activate();

      function activate() {
         var query = $stateParams.query;
         $scope.$emit('set:query:people', query);
         vm.people = personRepository.query({ syntheticName: query });
      }
   }

})();
