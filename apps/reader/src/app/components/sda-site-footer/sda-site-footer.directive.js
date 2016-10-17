(function () {
   'use strict';

   angular
      .module('sdaReader')
      .directive('sdaSiteFooter', sdaSiteFooter);

   /** @ngInject */
   function sdaSiteFooter() {
      var directive = {
         restrict: 'AC',
         templateUrl: 'app/components/sda-site-footer/sda-site-footer.html',
         link: linkFunc,
         scope: {},
         controller: SdaSiteFooterController,
         controllerAs: 'vm'
      };

      return directive;

      function linkFunc(scope, el, attr) {
         el.addClass('site-footer');

         if (attr.collapsible) {
            el.addClass('toggleable');
            scope.toggleable = true;
            scope.vm.isFooterShown = false;
         }
      }

      /** @ngInject */
      function SdaSiteFooterController() {
         var vm = this;

         vm.isFooterShown = true;
         vm.toggleFooter = toggleFooter;

         function toggleFooter() {
            vm.isFooterShown = !vm.isFooterShown;
         }
      }
   }

})();
