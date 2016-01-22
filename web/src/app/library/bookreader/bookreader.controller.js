(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBookreaderController', LibraryBookreaderController);

   /** @ngInject */
   function LibraryBookreaderController($state, $stateParams, $sce, copyRefRepository, googleBooksApi) {
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
         // var copyId = copyRef.copyId;
         // HACK: hard-coded google book for demonstration purposes
         var copyId = 'gb:000000000#ISBN:0738531367';

         // HACK: determine better way of 'switching' and 'matching' on a string
         var idParts = copyId.match(/^htid:(\d{9})#(.+)$/);
         if (idParts) {
            var htid = idParts[2];
            vm.book = {
               type: 'hathitrust',
               src: $sce.trustAsResourceUrl('https://babel.hathitrust.org/cgi/pt?id=' + htid + ';ui=embed')
            };
         } else {
            idParts = copyId.match(/^gb:(\d{9})#(.*)$/);
            if (idParts) {
               var gbid = idParts[2];
               vm.book = {
                  type: 'google-books',
                  id: gbid
               };
            } else {
               throw new Error('expected resource identifier, received {' + copyId + '}');
            }
         }

      }

      function searchPeople() {
         $state.go('sda.library.search-people', { query: vm.peopleQuery });
      }

      function searchBooks() {
         $state.go('sda.library.search-books', { query: vm.bookQuery });
      }
   }

})();
