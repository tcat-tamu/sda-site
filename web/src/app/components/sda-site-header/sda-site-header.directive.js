(function () {
   'use strict';

   angular
      .module('sda')
      .directive('sdaSiteHeader', sdaSiteHeader);

   /** @ngInject */
   function sdaSiteHeader() {
      var directive = {
         restrict: 'AC',
         templateUrl: 'app/components/sda-site-header/sda-site-header.html',
         link: linkFunc,
         scope: {},
         controller: SdaSiteHeaderController,
         controllerAs: 'vm'
      };

      return directive;

      function linkFunc(scope, el) {
         el.addClass('site-header');
      }

      /** @ngInject */
      function SdaSiteHeaderController($timeout) {
         var vm = this;

         vm.isSearchFormVisible = false;
         vm.toggleSearchForm = toggleSearchForm;

         activate();

         function activate() {
         }

         function toggleSearchForm() {
            vm.isSearchFormVisible = !vm.isSearchFormVisible;
            $timeout(function () {
               // HACK: give element time to display before focusing
               angular.element('input#search').focus();
            }, 100);
         }
      }
   }

})();
