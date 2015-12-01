(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryPeopleSearchController', LibraryPeopleSearchController);

   /** @ngInject */
   function LibraryPeopleSearchController($stateParams, $scope) {
      var vm = this;

      activate();

      function activate() {
         $scope.$emit('set:query:people', $stateParams.query);
      }
   }

})();
