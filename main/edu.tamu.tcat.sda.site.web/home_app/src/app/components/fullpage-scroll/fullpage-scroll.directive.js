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
         el.fullpage({
            scrollOverflow: true,
            paddingTop: '4rem' // HACK
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
