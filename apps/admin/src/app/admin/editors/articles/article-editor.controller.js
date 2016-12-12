(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ArticleEditorController', ArticleEditorController);

  var CKEDITOR_CONFIG = {
    /*
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
    */

    toolbar: [
      { name: 'styles', items: [ 'Styles', 'Format' ] },
      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
      { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
      { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
      { name: 'insert', items: [ 'Citation', 'Footnote', '-', 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
      { name: 'editing', items: [ 'Scayt' ] },
      { name: 'tools', items: [ 'Maximize' ] },
      { name: 'document', items: [ 'Source' ] }
    ],

    // See http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-format_tags
    format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address',

    extraPlugins: 'mathjax',

    mathJaxLib: '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-MML-AM_CHTML'
  };

  /** @ngInject */
  function ArticleEditorController($q, $log, $stateParams, $scope, footnoteEditDialog, sdaToast, articlesRepo, refsRepoFactory) {
    var refsRepoUrl = articlesRepo.getReferencesEndpoint($stateParams.id);
    var refsRepo = refsRepoFactory.getRepo(refsRepoUrl);

    var vm = this;

    vm.save = save;

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

    vm.footnoteEditor = {
      config: angular.extend({}, CKEDITOR_CONFIG, {
        removeButtons: [
          'Styles',
          'Format',
          'Subscript',
          'Superscript',
          'Cut',
          'Copy',
          'Footnote',
          'HorizontalRule',
          'Maximize',
          'Source',
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
      var articlePromise = vm.article.$promise;
      articlePromise.then(function (article) {
        // ensure article has at least 1 author
        if (article.authors.length === 0) {
          article.authors.push({});
        }
      });

      vm.references = refsRepo.get();
      var refsPromise = vm.references.$promise;

      $q.all([articlePromise, refsPromise]).then(function () {
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

     /**
      * Displays a bottom sheet to edit an existing footnote.
      * Delegates to the edit dialog in ckeditor-footnotes component, which should probably be refactored elsewhere.
      * @param  {MouseEvent} $event
      * @param  {Footnote} footnote
      */
     function editFootnote($event, footnote) {
       var newFootnote = angular.copy(footnote);
       var newReferences = refsRepoFactory.createRefCollection();

       var promise = footnoteEditDialog.show($event, newFootnote, {
         references: newReferences,
         ckeditor: vm.footnoteEditor
       });

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
