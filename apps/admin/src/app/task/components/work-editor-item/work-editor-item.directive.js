(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('workEditorItem', workEditorItemDirective);

  /** @ngInject */
  function workEditorItemDirective($log) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/task/components/work-editor-item/work-editor-item.html',
      link: linkFunc,
      scope: {
        id: '=id'
      },
      controller: WorkEditorItemController,
      controllerAs: 'vm'
    };

    return directive;

    function linkFunc($scope) {
      if (!$scope.id) {
        $log.error('missing required attribute "id"');
      }
    }

    /** @ngInject */
    function WorkEditorItemController($scope, worksRepo) {
      var vm = this;

      vm.loaded = false;

      activate();

      function activate() {
        if ($scope.id) {
          vm.work = worksRepo.get($scope.id);
          vm.work.$promise.then(function () {
            vm.loaded = true;
          });
        }
      }
    }
  }

})();
