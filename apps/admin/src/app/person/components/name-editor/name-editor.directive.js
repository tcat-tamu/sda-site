(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .directive('nameEditor', nameEditorDirective);

  /** @ngInject */
  function nameEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/person/components/name-editor/name-editor.html',
      scope: {
        name: '=ngModel'
      }
    };

    return directive;
  }

})();
