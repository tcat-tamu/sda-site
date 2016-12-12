(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .component('articleAuthorEditor', {
      templateUrl: 'app/admin/editors/articles/components/article-author-editor/article-author-editor.html',
      controller: ArticleAuthorEditorController,
      bindings: {
        author: '='
      }
    });

  /** @ngInject */
  function ArticleAuthorEditorController() {
    var vm = this;

    activate();

    // PUBLIC METHODS

    // PRIVATE METHODS

    function activate() {}
  }

})();
