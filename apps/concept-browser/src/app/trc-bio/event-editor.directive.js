(function () {
  'use strict';

  angular
    .module('trcBio')
    .directive('trcEventEditor', trcEventEditorDirective);

  /** @ngInject */
  function trcEventEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/trc-bio/event-editor.html',
      scope: {
        event: '=ngModel'
      }
    };

    return directive;
  }

})();
