(function () {
   'use strict';

   angular
      .module('sda')
      .directive('sdaTabbedSidebar', sdaTabbedSidebar);

   /** @ngInject */
   function sdaTabbedSidebar() {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/components/sda-tabbed-sidebar/sda-tabbed-sidebar.html',
         transclude: true,
         replace: true,
         scope: {
            fixed: '=',
            toplink: '='
         },
         controller: SdaTabbedSidebarController,
         controllerAs: 'vm'
      };

      return directive;

      /** @ngInject */
      function SdaTabbedSidebarController($document) {
         var vm = this;

         vm.tabs = [];
         vm.addTab = addTab;
         vm.activateTab = activateTab;
         vm.scrollToTop = scrollToTop;

         function addTab(tab) {
            if (vm.tabs.length === 0) {
               tab.active = true;
            }

            vm.tabs.push(tab);
         }

         function activateTab(tab) {
            vm.tabs.forEach(function (tab) {
               tab.active = false;
            });

            tab.active = true;
         }

         function scrollToTop() {
            $document.duScrollTopAnimated(0);
         }
      }
   }

})();
