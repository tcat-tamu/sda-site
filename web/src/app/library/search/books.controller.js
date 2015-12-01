(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBooksSearchController', LibraryBooksSearchController);

   /** @ngInject */
   function LibraryBooksSearchController($stateParams, $scope) {
      var vm = this;

      activate();

      function activate() {
         $scope.$emit('set:query:book', $stateParams.query);
      }
   }

})();
