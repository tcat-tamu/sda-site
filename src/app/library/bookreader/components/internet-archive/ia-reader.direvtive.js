(function () {
   'use strict';

   angular
      .module('sda.library')
      .directive('iaReader', iaReader);

   /** @ngInject */
   function iaReader($sce) {
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
            //  <iframe class="reader flex" src="https://archive.org/stream/essayinanswertom00adamiala?ui=embed#page/n5/mode/2up" frameborder="0"></iframe>
           scope.src = $sce.trustAsResourceUrl('https://archive.org/stream/' + properties.id + '?ui=embed#mode/2up');
        });
      }
   }

})();
