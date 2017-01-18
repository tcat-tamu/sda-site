(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('AboutEditorSectionController', AboutEditorSectionController);

  /** @ngInject */
  function AboutEditorSectionController($state, $mdDialog, sdaToast, articlesRepo) {
    var vm = this;

    vm.createArticle = createArticle;

    // PUBLIC METHODS

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
        .title('Create Page')
        .textContent('Please provide a title for the new page.')
        .placeholder('title')
        .ok('Create')
        .cancel('Cancel');

      var titlePromise = $mdDialog.show(dialog);

      titlePromise.then(function (title) {
        var page = articlesRepo.create(type, title);
        var savePromise = articlesRepo.save(page);

        savePromise.then(function (page) {
          $state.go('about.edit', { id: page.id });
          sdaToast.success('Page created successfully');
        }, function () {
          sdaToast.error('Unable to create page');
        });

        return savePromise;
      });
    }
  }

})();
