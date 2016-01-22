(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBookreaderController', LibraryBookreaderController);


   /** @ngInject */
   function LibraryBookreaderController($state, $stateParams, $sce, $log, copyRefRepository) {
      var copyRefHandlers = {
         htid: hathiTrustCopyRefHandler,
         gb: googleBooksCopyRefHandler
      }

      var vm = this;

      vm.peopleQuery = '',
      vm.bookQuery = '',
      vm.searchPeople = searchPeople;
      vm.searchBooks = searchBooks;

      vm.book = {};
      vm.copyRef = null;

      activate();

      function activate() {
         vm.copyRef = copyRefRepository.get({ id: $stateParams.copyId }, onCopyRefLoaded);
      }

      function onCopyRefLoaded(copyRef) {
         var copyId = copyRef.copyId;

         // HACK: determine better way of 'switching' and 'matching' on a string
         var idParts = copyId.match(/^([^:]+):(\d{9})#(.+)$/);
         var type = idParts[1];
         if (copyRefHandlers[type]) {
            vm.book = copyRefHandlers[type](copyRef);
         } else {
            $log.error('unable to find handler for copy reference {' + copyId + '}');
         }
      }

      function searchPeople() {
         $state.go('sda.library.search-people', { query: vm.peopleQuery });
      }

      function searchBooks() {
         $state.go('sda.library.search-books', { query: vm.bookQuery });
      }


      /**
       * Transforms a HathiTrust copy reference into a view model for display
       *
       * @param {CopyReference} copyRef
       * @return {object}
       */
      function hathiTrustCopyRefHandler(copyRef) {
         var idParts = copyRef.copyId.match(/^htid:(\d{9})#(.*)$/);

         if (!idParts) {
            throw new Error('expected HathiTrust resource identifier, received {' + copyRef.copyId + '}');
         }

         var htid = idParts[2];

         return {
            type: 'hathitrust',
            id: htid
         };
      }

      /**
       * Transforms a HathiTrust copy reference into a view model for display
       *
       * @param {CopyReference} copyRef
       * @return {object}
       */
      function googleBooksCopyRefHandler(copyRef) {
         var idParts = copyRef.copyId.match(/^gb:(\d{9})#(.*)$/);

         if (!idParts) {
            throw new Error('expected Google Books resource identifier, received {' + copyRef.copyId + '}');
         }

         var gbid = idParts[2];

         return {
            type: 'google-books',
            id: gbid
         };
      }
   }

})();
