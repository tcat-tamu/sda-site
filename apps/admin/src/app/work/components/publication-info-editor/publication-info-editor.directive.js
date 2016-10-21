(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .directive('publicationInfoEditor', publicationInfoEditorDirective);

  /** @ngInject */
  function publicationInfoEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/work/components/publication-info-editor/publication-info-editor.html',
      scope: {
        pubInfo: '=ngModel'
      }
    };

    return directive;
  }

})();
