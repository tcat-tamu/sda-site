(function () {
   'use strict';

   angular
      .module('sdaBookReader')
      .directive('sdaTabbedSidebar', sdaTabbedSidebar);

   /** @ngInject */
   function sdaTabbedSidebar() {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/components/sda-tabbed-sidebar/sda-tabbed-sidebar.html',
         transclude: true,
         replace: true,
         scope: {
            activeTab: '=',
            fixed: '=',
            toplink: '=',
            backlink: '=',
            goBack: '&'
         },
         controller: SdaTabbedSidebarController,
         controllerAs: 'vm',
         link: linkFunc
      };

      return directive;

      function linkFunc(scope) {
         scope.$watch('activeTab', function (value) {
            if (!value) {
               return;
            }

            scope.vm.activateTabById(value);
         });
      }

      /** @ngInject */
      function SdaTabbedSidebarController($window, $document, $scope) {
         var vm = this;

         vm.tabs = [];
         vm.addTab = addTab;
         vm.activateTab = activateTab;
         vm.activateTabById = activateTabById;
         vm.scrollToTop = scrollToTop;
         vm.goBack = goBack;

         function addTab(tab) {
            if (($scope.activeTab && $scope.activeTab === tab.id) ||
               (!$scope.activeTab && vm.tabs.length === 0))
            {
               tab.active = true;
            }

            vm.tabs.push(tab);
         }

         function activateTab(tab) {
            if (!tab) {
               return;
            }

            var oldTab = null;
            vm.tabs.forEach(function (tab) {
               if (tab.active) {
                  oldTab = tab;
               }

               tab.active = false;
            });

            tab.active = true;

            if (tab !== oldTab) {
               $scope.$emit('sda-tabbed-sidebar:change:tab', tab, oldTab);
            }
         }

         function activateTabById(tabId) {
            if (!tabId) {
               return;
            }

            var tab = vm.tabs.find(function (tab) {
               return tab.id == tabId;
            });

            activateTab(tab);
         }

         function scrollToTop() {
            $document.duScrollTopAnimated(0);
         }

         function goBack() {
            if ($scope.goBack) {
               $scope.goBack();
            } else {
               $window.history.back();
            }
         }
      }
   }

})();
