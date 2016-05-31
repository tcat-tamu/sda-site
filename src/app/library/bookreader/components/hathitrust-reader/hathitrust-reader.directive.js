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
            properties: '='
         }
      };

      return directive;

      function linkFunc(scope) {
        scope.$watch('properties', function(properties) {
           // TODO add page link
           scope.src = $sce.trustAsResourceUrl('https://babel.hathitrust.org/cgi/pt?id=' + properties.htid + ';ui=embed')
        });
      }
   }

})();
