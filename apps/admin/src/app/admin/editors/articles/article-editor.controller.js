(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ArticleEditorController', ArticleEditorController);

  var CKEDITOR_CONFIG = {
    toolbarGroups: [
      { name: 'styles', groups: [ 'styles' ] },
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
      { name: 'colors', groups: [ 'colors' ] },
      { name: 'links', groups: [ 'links' ] },
      { name: 'insert', groups: [ 'insert' ] },
      { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
      { name: 'forms', groups: [ 'forms' ] },
      { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
      { name: 'tools', groups: [ 'tools' ] },
      { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
      { name: 'others', groups: [ 'others' ] },
    ],

    // See http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-format_tags
    format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address',

    extraPlugins: 'mathjax',

    mathJaxLib: '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-MML-AM_CHTML'
  };

  /** @ngInject */
  function ArticleEditorController($q, $log, $stateParams, $scope, $mdBottomSheet, sdaToast, articlesRepo, refsRepoFactory) {
    var refsRepoUrl = articlesRepo.getReferencesEndpoint($stateParams.id);
    var refsRepo = refsRepoFactory.getRepo(refsRepoUrl);

    var vm = this;

    vm.save = save;
    vm.cancel = cancel;
    vm.body = "test";

    vm.abstractEditor = {
      config: angular.extend({}, CKEDITOR_CONFIG, {
        removeButtons: [
          'Styles',
          'Format',
          'Subscript',
          'Superscript',
          'Cut',
          'Copy',
          'HorizontalRule',
          'Maximize',
          'Source'
        ].join(',')
      })
    };

    vm.editor = {
      config: angular.extend({}, CKEDITOR_CONFIG, {
        removeButtons: [
          'Styles',
          'Subscript',
          'Superscript',
          'Cut',
          'Copy',
          'Source'
        ].join(',')
      })
    };

    vm.editFootnote = editFootnote;

    activate();

    function activate() {
      $log.info("Loading article editor", articlesRepo)

      vm.article = articlesRepo.get($stateParams.id);
      vm.references = refsRepo.get();

      $q.all([vm.article.$promise, vm.references.$promise]).then(function () {
        // start watching for opportunities to remove unused citations and footnotes
        $scope.$watch('vm.article.body', cleanArticleHandler);
        $scope.$watchCollection('vm.article.footnotes', cleanRefsHandler);
      }, function () {
        return sdaToast.error('Failed to load data from the server');
      });

      /* initialization logic here */
    }

    /* ================================
     * API METHODS
     * ================================ */
     function save() {
       return $q.all([
         articlesRepo.save(vm.article),
         refsRepo.save(vm.references)
       ]).then(function () {
         sdaToast.success('Saved');
       }, function () {
         sdaToast.error('Unable to save article.');
       });
     }

     function cancel() {
       // TODO: not sure what this is supposed to do
       alert('cancel');
     }

     /**
      * Displays a bottom sheet to edit an existing footnote.
      * Delegates to the edit dialog in ckeditor-footnotes component, which should probably be refactored elsewhere.
      * @param  {MouseEvent} $event
      * @param  {Footnote} footnote
      */
     function editFootnote($event, footnote) {
       var newFootnote = angular.copy(footnote);
       var newReferences = refsRepoFactory.createRefCollection();

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
         vm.article.footnotes[newFootnote.id] = newFootnote;

         // update bibliography
         var updatedReferences = refsRepoFactory.merge(vm.references, refsRepoFactory.compact(newReferences));
         angular.merge(vm.references, updatedReferences);
       });
     }

    /* ================================
     * PRIVATE METHODS
     * ================================ */

     function cleanRefsHandler(obj) {
       if (!obj) {
         return;
       }

       articlesRepo.cleanReferences(vm.article, vm.references);
       vm.references = refsRepo.compact(vm.references);
     }

     function cleanArticleHandler(obj) {
       if (!obj) {
         return;
       }

       articlesRepo.cleanFootnotes(vm.article, vm.article.footnotes);
       cleanRefsHandler(obj);
     }
  }
})();
