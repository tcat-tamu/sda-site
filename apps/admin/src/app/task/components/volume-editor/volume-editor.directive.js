(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .directive('volumeEditor', volumeEditorDirective);

  /** @ngInject */
  function volumeEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/work/components/volume-editor/volume-editor.html',
      scope: {
        volume: '=ngModel'
      }
    };

    return directive;
  }

})();
