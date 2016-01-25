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
      function SdaSiteHeaderController($timeout, $rootScope) {
         var vm = this;

         vm.isSearchFormVisible = false;
         vm.toggleSearchForm = toggleSearchForm;

         vm.isNavMenuVisible = false;
         vm.toggleNavMenu = toggleNavMenu;

         activate();

         function activate() {
            $rootScope.$on('$stateChangeStart', function () {
               // hide nav menu when going somewhere else
               vm.isNavMenuVisible = false;
            });
         }

         function toggleSearchForm() {
            vm.isSearchFormVisible = !vm.isSearchFormVisible;
            vm.isNavMenuVisible = false;

            $timeout(function () {
               // HACK: give element time to display before focusing
               angular.element('input#search').focus();
            }, 100);
         }

         function toggleNavMenu() {
            vm.isNavMenuVisible = !vm.isNavMenuVisible;
            vm.isSearchFormVisible = false;
         }
      }
   }

})();
