(function () {
   'use strict';

   angular
      .module('sda.library')
      .directive('hathitrustReader', hathitrustReader);

   /** @ngInject */
   function hathitrustReader($sce) {
      var directive = {
         restrict: 'E',
         template: '<iframe ng-src="{{src}}">',
         replace: true,
         link: linkFunc,
         scope: {
            bookId: '='
         }
      };

      return directive;

      function linkFunc(scope) {
         scope.$watch('bookId', function (id) {
            scope.src = $sce.trustAsResourceUrl('https://babel.hathitrust.org/cgi/pt?id=' + id + ';ui=embed')
         });
      }
   }

})();
