(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .directive('ckeditorFootnotes', ckeditorFootnotesDirective);

  /** @ngInject */
  function ckeditorFootnotesDirective($document, $mdBottomSheet, articlesRepo, refsRepoFactory) {
    var directive = {
      restrict: 'A',
      require: ['ckeditor', 'ckeditorFootnotes', '?ckeditorBibliography'],
      link: linkFunc,
      controller: 'DataContainerController'
    };

    return directive;

    function linkFunc(scope, el, attrs, requires) {
      var anchorIdPrefix = attrs.ckeditorFootnotesAnchorIdPrefix || 'fn_anchor_';

      var ckeditor = requires[0];
      var ctrl = requires[1];
      var ckeditorBibliography = requires[2];

      var editor = ckeditor.instance;

      var scopeValueExpr = attrs.ckeditorFootnotes;

      // capture footnotes reference from outer scope
      ctrl.set(scope.$eval(scopeValueExpr));

      // keep internal reference up-to-date
      scope.$watch(scopeValueExpr, function (footnotes) {
        if (ctrl.value !== footnotes) {
          ctrl.set(footnotes);
        }
      });

      var FOOTNOTE_COMMAND_NAME = 'insertFootnote';
      editor.addCommand(FOOTNOTE_COMMAND_NAME, {
        async: true,
        allowedContent: 'sup[id,data-footnote,contenteditable](footnote)',
        requiredContent: 'sup[id,data-footnote,contenteditable](footnote)',
        exec: insertFootnoteCommand
      });

      editor.ui.addButton('Footnote', {
        label: 'Insert Footnote',
        command: FOOTNOTE_COMMAND_NAME,
        toolbar: 'insert'
      });

      function insertFootnoteCommand(editor) {
        var command = this;

        // create a new footnote object to edit.
        var newFootnote = articlesRepo.createFootnote();
        newFootnote.backlinkId = anchorIdPrefix + newFootnote.id;

        var newReferences = ckeditorBibliography ? refsRepoFactory.createRefCollection() : null;

        var config = {
          templateUrl: 'app/components/ckeditor-footnotes/footnote-edit-dialog.html',
          controller: 'FootnoteEditDialogController',
          controllerAs: 'vm',
          clickOutsideToClose: false,
          locals: {
            footnote: newFootnote,
            references: newReferences
          }
        };

        var promise = $mdBottomSheet.show(config);

        promise.then(function () {
          ctrl.value[newFootnote.id] = newFootnote;

          // update bibliography if provided
          if (newReferences && ckeditorBibliography) {
            var updatedReferences = refsRepoFactory.merge(ckeditorBibliography.value, refsRepoFactory.compact(newReferences));
            angular.merge(ckeditorBibliography.value, updatedReferences);
          }

          editor.insertHtml('<sup contenteditable="false" class="footnote" id="' + newFootnote.backlinkId + '" data-footnote="' + newFootnote.id + '">#</a>');
          done();
        }, function () {
          done();
        });

        function done() {
          editor.fire('afterCommandExec', {
            name: FOOTNOTE_COMMAND_NAME,
            command: command
          });
        }
      }
    }
  }

})();
