(function () {
   'use strict';

   angular
      .module('sdaBookReader')
      .controller('LibraryBookreaderController', LibraryBookreaderController);


   /** @ngInject */
   function LibraryBookreaderController($state, $stateParams, copyRefRepository, $scope, $timeout) {
      var vm = this;

      vm.fullscreen = false;

      vm.peopleQuery = '',
      vm.bookQuery = '',

      vm.toggleFullscreen = toggleFullscreen;
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

      function toggleFullscreen() {
         vm.fullscreen = !vm.fullscreen;

         // HACK force google reader to resize itself
         $timeout(function () {
            $scope.$broadcast('resize');
         }, 500);
      }
   }

})();
