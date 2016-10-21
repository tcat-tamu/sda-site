(function () {
  'use strict';

  angular
    .module('vwise')
    .directive('volumePanel', volumePanelDirective);

  /** @ngInject */
  function volumePanelDirective(worksRepo) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/vwise/components/work-panel/volume-panel.html',
      scope: {
        volume: '=',
        workId: '@',
        editionId: '@'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope) {
      scope.title = worksRepo.getTitle(scope.volume.titles);

      scope.edition = worksRepo.getEdition(scope.workId, scope.editionId);
    }
  }

})();
