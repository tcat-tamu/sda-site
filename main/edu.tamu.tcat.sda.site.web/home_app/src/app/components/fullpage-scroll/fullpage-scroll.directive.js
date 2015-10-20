(function () {
   'use strict';

   angular
      .module('sda.site')
      .directive('fullpageScroll', fullpageScroll);

   /** @ngInject */
   function fullpageScroll($window) {
      var directive = {
         restrict: 'AC',
         link: linkFunc,
         controller: FullpageScrollController,
         controllerAs: 'fullpageScroll'
      };

      return directive;

      function linkFunc(scope, el) {
         scope.vm.fullpage = el.fullpage({
            scrollOverflow: true
         });
      }

      /** @ngInject */
      function FullpageScrollController() {
         var vm = this;

         vm.nextSection = nextSection;

         function nextSection() {
            $window.jQuery.fn.fullpage.moveSectionDown();
         }
      }
   }

})();
