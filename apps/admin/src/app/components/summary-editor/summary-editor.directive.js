(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('summaryEditor', summaryEditorDirective);

  /** @ngInject */
  function summaryEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/summary-editor/summary-editor.html',
      scope: {
        summary: '=ngModel'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope) {
      scope.config = {
        // FIXME set up minimal toolbar and restrict HTML content
        toolbarGroups: [
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
          { name: 'links', groups: [ 'links' ] },
          { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] }
        ],

        removeButtons: 'Subscript,Superscript,About,Cut,Copy,Maximize,Styles'
      };
    }
  }

})();
