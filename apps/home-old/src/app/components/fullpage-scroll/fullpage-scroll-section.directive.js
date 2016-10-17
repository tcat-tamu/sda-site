(function () {
   'use strict';

   angular
      .module('sda')
      .directive('fullpageScrollSection', fullpageScrollSection);

   /** @ngInject */
   function fullpageScrollSection() {
      var directive = {
         require: '^fullpageScroll',
         link: linkFunc,
         transclude: true,
         replace: true,
         template: '<div class="fullpage-scroll-section" ng-transclude></div>'
      };

      return directive;

      function linkFunc(scope, el, attr, parent) {
         parent.rebuild();
      }
   }

})();
