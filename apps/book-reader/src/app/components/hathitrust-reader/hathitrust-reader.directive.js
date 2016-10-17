(function () {
   'use strict';

   var READER_URL = 'https://babel.hathitrust.org/cgi/pt';

   angular
      .module('sdaBookReader')
      .directive('hathitrustReader', hathitrustReader);

   /** @ngInject */
   function hathitrustReader($sce, _) {
      var directive = {
         restrict: 'E',
         template: '<iframe ng-src="{{src}}">',
         replace: true,
         link: linkFunc,
         scope: {
            properties: '='
         }
      };

      return directive;

      function linkFunc(scope) {
         scope.$watch('properties', function (properties) {
            var params = {
               id: properties.htid,
               ui: 'embed'
            };

            if (properties.seq) {
               params.seq = properties.seq;
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
