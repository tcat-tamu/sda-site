(function () {
   'use strict';

   angular
      .module('sda.home')
      .directive('sdaNavSection', sdaNavSection);

   /** @ngInject */
   function sdaNavSection() {
      var directive = {
         require: '^sdaNavBucket',
         restrict: 'E',
         templateUrl: 'app/home/components/sda-nav/sda-nav-section.html',
         transclude: true,
         replace: true,
         link: linkFunc,
         scope: {
            title: '@'
         },
         bindToController: true,
         controller: SectionController,
         controllerAs: 'vm'
      };

      return directive;

      function linkFunc(scope, el, attr, vm) {
         vm.add(scope.vm);
      }

      /** @ngInject */
      function SectionController() {
         var vm = this;

         vm.active = false;
         vm.title = '';
      }
   }

})();
