(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBooksSearchController', LibraryBooksSearchController);

   /** @ngInject */
   function LibraryBooksSearchController($stateParams, $scope, workRepository) {
      var vm = this;

      vm.books = [];

      activate();

      function activate() {
         var query = $stateParams.query;
         $scope.$emit('set:query:book', query);
         vm.books = workRepository.query({ q: query });
      }
   }

})();
