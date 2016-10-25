(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('workEditor', workEditorDirective);

  /** @ngInject */
  function workEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/work/components/work-editor/work-editor.html',
      scope: {
        work: '=ngModel'
      },
      controller: WorkEditorController,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function WorkEditorController($scope, worksRepo, _) {
      var vm = this;

      vm.editions = [];

      vm.createEdition = createEdition;
      vm.deleteEdition = deleteEdition;

      activate();

      function activate() {
        $scope.work.editions.forEach(function (edition) {
          vm.editions.push({
            model: edition,
            focused: false
          });
        });
      }

      function createEdition() {
        var edition = worksRepo.createEdition();
        edition.titles = _.cloneDeep($scope.work.titles);
        edition.authors = _.cloneDeep($scope.work.authors);

        $scope.work.editions.push(edition);
        vm.editions.push({
          model: edition,
          focused: true
        });
      }

      function deleteEdition(ix) {
        vm.editions.splice(ix, 1);
        $scope.work.editions.splice(ix, 1);
      }
    }
  }
})();
