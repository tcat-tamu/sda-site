(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBookreaderController', LibraryBookreaderController);

   /** @ngInject */
   function LibraryBookreaderController($state, $stateParams, $sce, copyRefRepository) {
      var vm = this;

      vm.peopleQuery = '',
      vm.bookQuery = '',
      vm.searchPeople = searchPeople;
      vm.searchBooks = searchBooks;

      vm.bookUrl = '';
      vm.copyRef = null;

      activate();

      function activate() {
         vm.copyRef = copyRefRepository.get({ id: $stateParams.copyId }, onCopyRefLoaded);
      }

      function onCopyRefLoaded(copyRef) {
         var idParts = copyRef.copyId.match(/^htid:(\d{9})#(.+)$/);
         if (!idParts) {
            throw new Error('expected HathiTrust resource identifier, received {' + copyRef.copyId + '}');
         }

         var htid = idParts[2];
         vm.bookUrl = $sce.trustAsResourceUrl('https://babel.hathitrust.org/cgi/pt?id=' + htid + ';ui=embed');
      }

      function searchPeople() {
         $state.go('sda.library.search-people', { query: vm.peopleQuery });
      }

      function searchBooks() {
         $state.go('sda.library.search-books', { query: vm.bookQuery });
      }
   }

})();
