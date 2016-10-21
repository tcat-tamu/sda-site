(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .directive('eventEditor', eventEditorDirective);

  /** @ngInject */
  function eventEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/person/components/event-editor/event-editor.html',
      scope: {
        event: '=ngModel'
      }
    };

    return directive;
  }

})();
