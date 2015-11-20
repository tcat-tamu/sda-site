(function () {
   'use strict';

   angular
      .module('sda')
      .directive('sdaSidebarTab', sdaSidebarTab);

   /** @ngInject */
   function sdaSidebarTab() {
      var directive = {
         restrict: 'E',
         require: '^sdaTabbedSidebar',
         template: '<div ng-show="active" ng-transclude></div>',
         replace: true,
         scope: {
            icon: '@',
            title: '@'
         },
         transclude: true,
         link: linkFunc
      };

      return directive;

      function linkFunc(scope, el, attr, parent) {
         scope.active = false;
         parent.addTab(scope);
      }
   }

})();
