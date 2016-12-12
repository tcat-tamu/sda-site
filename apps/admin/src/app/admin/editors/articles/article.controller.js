(function () {
  'use strict';

// TODO admin-page-articles
  angular
    .module('sdaAdmin')
    .controller('ArticleEditorSectionController', ArticleEditorSectionController);

  /** @ngInject */
  function ArticleEditorSectionController($state, $mdDialog, sdaToast, articlesRepo) {
    var vm = this;

    vm.createArticle = createArticle;

    activate();

    function activate() {
      /* initialization logic here */
    }

    /* ================================
     * API METHODS
     * ================================ */

    /**
     * Creates a new article of the given type and opens that article in the editor
     *
     * @param {Event} $event
     * @param {string} type
     * @return {Promise.<Article>} Resolves after the article has been created and saved on the server
     */
    function createArticle($event, type) {
      var dialog = $mdDialog.prompt()
        .targetEvent($event)
        .title('Create Article')
        .textContent('Please provide a title for the new article.')
        .placeholder('title')
        .ok('Create')
        .cancel('Cancel');

      var titlePromise = $mdDialog.show(dialog);

      titlePromise.then(function (title) {
        var article = articlesRepo.create(type, title);
        var savePromise = articlesRepo.save(article);

        savePromise.then(function (article) {
          $state.go('article.edit', { id: article.id });
          sdaToast.success('Article created successfully');
        }, function () {
          sdaToast.error('Unable to create article');
        });

        return savePromise;
      });

    }

    /* ================================
     * PRIVATE METHODS
     * ================================ */
  }
})();
