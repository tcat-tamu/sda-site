(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibrarySearchController', LibrarySearchController);

   /** @ngInject */
   function LibrarySearchController($stateParams, $scope) {
      var vm = this;

      activate();

      function activate() {
         $scope.$emit('set:query', $stateParams.query);
      }
   }

})();
