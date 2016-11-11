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
        scheme: '@',
        activeRefId: '<'
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

    vm.categories.$promise.then(function () {
      // expand top-level categories by default
      vm.categories.root.children.forEach(function (child) {
        child.expanded = true;
      });

      $scope.$watch('activeRefId', function (activeRefId) {
        if (!activeRefId) {
          return;
        }

        expandToActive(vm.categories.root, activeRefId);
      });
    });

    /**
     * Perforrms a DFS looking for the node with the given ref id and expands
     * the ancestry leading up to that node
     */
    function expandToActive(node, activeRefId) {
      // stop case 1: we found the active node
      if (node.entryRef && node.entryRef.id === activeRefId) {
        node.expanded = true;
        return true;
      }

      // stop case 2: we haven't found the active node and we can't go any deeper
      if (node.children.length === 0) {
        return false;
      }

      // tail recursion: expand this node if any of its children are active
      var isChildActive = node.children.some(function (child) {
        return expandToActive(child, activeRefId);
      });

      if (isChildActive) {
        node.expanded = true;
      }

      return isChildActive;
    }
  }

})();
