(function () {
   'use strict';

   angular
      .module('google.books')
      .directive('googleBookReader', googleBookReader);

   /** @ngInject */
   function googleBookReader(googleBooksApi, googleBooksApiManualLoader) {
      var directive = {
         restrict: 'E',
         link: linkFunc,
         scope: {
            bookId: '='
         }
      };

      return directive;

      function linkFunc(scope, el) {
         googleBooksApiManualLoader.load();
         googleBooksApi.then(function (books) {
            var viewer = new books.DefaultViewer(el.get(0));
            viewer.load(scope.bookId);
         });
      }
   }

})();
