(function () {
   'use strict';

   angular
      .module('slideToggle')
      .directive('slideToggle', slideToggle);

   /** @ngInject */
   function slideToggle() {
      var directive = {
         restrict: 'A',
         scope: {
            active: '=slideToggle'
         },
         link: linkFunc
      };

      return directive;

      function linkFunc(scope, el, attr) {
         var duration = parseInt(attr.slideToggleDuration) || 200;
         scope.$watch('active', function (active) {
            if (active) {
               el.stop().slideDown(duration);
            } else {
               el.stop().slideUp(duration);
            }
         })
      }
   }

})();
