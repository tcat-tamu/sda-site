/**
 * Inspired by https://github.com/angular-ui/angular-google-maps/blob/f7c17e4336344afe9c31ca8b8a1e200e268f4979/src/coffee/providers/map-loader.coffee
 */
(function () {
   'use strict';

   angular
      .module('sdaSite')
      .directive('googleBookReader', googleBookReader);

   /** @ngInject */
   function googleBookReader(googleBooksApi, googleBooksApiManualLoader) {
      var directive = {
         restrict: 'E',
         link: linkFunc,
         scope: {
            bookId: '=',
            page: '='
         }
      };

      return directive;

      function linkFunc(scope, el) {
         googleBooksApiManualLoader.load();
         googleBooksApi.then(function (books) {
            var viewer = new books.DefaultViewer(el.get(0));

            scope.$watch('bookId', function (newBookId) {
               viewer.load(newBookId);
            });

            // TODO: page

            scope.$on('resize', function () {
               viewer.resize();
            });
         });
      }
   }

})();
