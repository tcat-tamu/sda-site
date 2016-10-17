(function () {
   'use strict';

   angular
      .module('sdaBookReader')
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
               el.stop().slideDown(duration, 'easeInOutCubic');
            } else {
               el.stop().slideUp(duration, 'easeInOutCubic');
            }
         })
      }
   }

})();
