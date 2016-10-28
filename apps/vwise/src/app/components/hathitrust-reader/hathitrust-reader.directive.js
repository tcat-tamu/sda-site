(function () {
   'use strict';

   var READER_URL = 'https://babel.hathitrust.org/cgi/pt';

   angular
      .module('sdaVwise')
      .directive('hathitrustReader', hathitrustReader);

   /** @ngInject */
   function hathitrustReader($sce, _) {
      var directive = {
         restrict: 'E',
         template: '<iframe ng-src="{{src}}">',
         replace: true,
         link: linkFunc,
         scope: {
            bookId: '=',
            page: '='
         }
      };

      return directive;

      function linkFunc(scope) {
         scope.$watchGroup(['bookId', 'page'], function (newData) {
           var newBookId = newData[0];
           var newPage = newData[1];

            var params = {
               id: newBookId,
               ui: 'embed'
            };

            if (newPage) {
               params.seq = newPage;
            }

            var queryString = _.map(params, function (value, key) {
               return key + '=' + value;
            }).join(';');

            var url = READER_URL + '?' + queryString;

            scope.src = $sce.trustAsResourceUrl(url);
         });
      }
   }

})();
