(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('ckeditorBibliography', ckeditorBibliographyDirective);

  /** @ngInject */
  function ckeditorBibliographyDirective($mdDialog, $document, refsRepoFactory, refsRenderer, citationEditDialog) {
    var directive = {
      restrict: 'A',
      require: ['ckeditor', 'ckeditorBibliography'],
      link: linkFunc,
      controller: 'DataContainerController'
    };

    return directive;

    function linkFunc(scope, el, attrs, requires) {
      var ckeditor = requires[0];
      var ctrl = requires[1];

      var editor = ckeditor.instance;

      var scopeValueExpr = attrs.ckeditorBibliography;

      // capture bibliography reference from outer scope
      ctrl.set(scope.$eval(scopeValueExpr));

      // keep internal reference up-to-date
      scope.$watch(scopeValueExpr, function (refs) {
        if (ctrl.value !== refs) {
          ctrl.set(refs);
        }
      });

      var CITATION_COMMAND_NAME = 'insertCitation';
      editor.addCommand(CITATION_COMMAND_NAME, {
        async: true,
        allowedContent: 'cite[id,contenteditable]',
        requiredContent: 'cite[id,contenteditable]',
        exec: insertCitationCommand
      });

      editor.ui.addButton('Citation', {
        label: 'Insert Citation',
        command: CITATION_COMMAND_NAME,
        toolbar: 'insert'
      });

      function insertCitationCommand(editor) {
        var command = this;

        // create citation object with its own ref collection for editing
        var newReference = refsRepoFactory.createRefCollection();
        var citation = refsRepoFactory.createCitation();
        newReference.citations[citation.id] = citation;

        citationEditDialog.show(newReference).then(function () {
          var updatedReferences = refsRepoFactory.merge(ctrl.value, refsRepoFactory.compact(newReference));
          angular.merge(ctrl.value, updatedReferences);

          refsRenderer.render('modern-language-association', newReference).then(function (rendered) {
            var label = rendered.citations[citation.id];
            editor.insertHtml('<cite id="' + citation.id + '" contenteditable="false">' + label + '</cite>')
            done();
          });
        }, function () {
          done();
        });

        function done() {
          editor.fire('afterCommandExec', {
            name: CITATION_COMMAND_NAME,
            command: command
          });
        }
      }
    }
  }

})();
