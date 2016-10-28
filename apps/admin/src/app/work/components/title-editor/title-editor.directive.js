(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('titleEditor', titleEditorDirective);

  /** @ngInject */
  function titleEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/work/components/title-editor/title-editor.html',
      scope: {
        title: '=ngModel'
      }
    };

    return directive;
  }

})();
