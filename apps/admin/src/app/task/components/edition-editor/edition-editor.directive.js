(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('editionEditor', editionEditorDirective);

  /** @ngInject */
  function editionEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/work/components/edition-editor/edition-editor.html',
      scope: {
        edition: '=ngModel'
      },
      controller: EditionEditorController,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function EditionEditorController($scope, worksRepo, _) {
      var vm = this;

      vm.volumes = [];

      vm.createVolume = createVolume;
      vm.deleteVolume = deleteVolume;

      activate();

      function activate() {
        $scope.edition.volumes.forEach(function (volume) {
          vm.volumes.push({
            model: volume,
            focused: false
          });
        });
      }

      function createVolume() {
        var volume = worksRepo.createVolume();
        volume.titles = _.cloneDeep($scope.edition.titles);
        volume.authors = _.cloneDeep($scope.edition.authors);
        volume.publicationInfo = _.cloneDeep($scope.edition.publicationInfo);

        $scope.edition.volumes.push(volume);
        vm.volumes.push({
          model: volume,
          focused: true
        });
      }

      function deleteVolume(ix) {
        vm.volumes.splice(ix, 1);
        $scope.edition.volumes.splice(ix, 1);
      }
    }
  }

})();
