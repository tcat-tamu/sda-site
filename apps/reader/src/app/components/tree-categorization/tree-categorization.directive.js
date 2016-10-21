(function () {
   'use strict';

   angular
      .module('sdaReader')
      .directive('treeCategorization', treeCategorizationDirective);

   /** @ngInject */
   function treeCategorizationDirective() {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/components/tree-categorization/tree-categorization.html',
         scope: {
            scopeId: '@',
            scheme: '@'
         },
         controller: TreeCategorizationController,
         controllerAs: 'vm'
      };

      return directive;
   }

   /** @ngInject */
   function TreeCategorizationController($scope, categorizationRepo) {
      var vm = this;

      vm.categories = categorizationRepo.get($scope.scopeId, $scope.scheme);
   }

})();
