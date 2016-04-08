(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBookreaderController', LibraryBookreaderController);


   /** @ngInject */
   function LibraryBookreaderController($state, $stateParams, $sce, $log, copyRefRepository) {
      var vm = this;

      vm.peopleQuery = '',
      vm.bookQuery = '',
      vm.searchPeople = searchPeople;
      vm.searchBooks = searchBooks;

      vm.copyRef = null;

      activate();

      function activate() {
         vm.copyRef = copyRefRepository.get({
            workId: $stateParams.workId,
            editionId: $stateParams.editionId,
            volumeId: $stateParams.volumeId,
            copyId: $stateParams.copyId });
      }

      function searchPeople() {
         $state.go('sda.library.main.search-people', { query: vm.peopleQuery });
      }

      function searchBooks() {
         $state.go('sda.library.main.search-books', { query: vm.bookQuery });
      }
   }

})();
