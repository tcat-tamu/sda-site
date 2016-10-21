(function () {
  'use strict';

  angular
    .module('vwise')
    .directive('editionPanel', editionPanelDirective);

  /** @ngInject */
  function editionPanelDirective(worksRepo) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/vwise/components/work-panel/edition-panel.html',
      scope: {
        edition: '=',
        workId: '@'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope) {
      scope.title = worksRepo.getTitle(scope.edition.titles);

      scope.edition.volumes.forEach(function (volume) {
        volume.type = 'volume';
        volume.workId = scope.workId;
        volume.editionId = scope.edition.id;
      });
    }
  }

})();
