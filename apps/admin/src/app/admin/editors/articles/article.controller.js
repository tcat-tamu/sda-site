(function () {
  'use strict';

// TODO admin-page-articles
  angular
    .module('sdaAdmin')
    .controller('ArticleEditorSectionController', ArticleEditorSectionController);

  /** @ngInject */
  function ArticleEditorSectionController(articlesRepo, $log, categorizationService) {
    var vm = this;
    //
    // vm.handleAssociateEntry = handleAssociateEntry;
    // vm.handleRemoveEntry = handleRemoveEntry;
    // vm.handleCreateChild = handleCreateChild;
    // vm.handleDeleteNode = handleDeleteNode;

    activate();

    function activate() {
      $log.info("Loading article editor", articlesRepo);
      // var repo = categorizationService.getScopedRepo('default');
      // vm.overviews = repo.get('overviews');

      /* initialization logic here */
    }

    /* ================================
     * API METHODS
     * ================================ */

    //  function handleAssociateEntry($event) {
    //    $log("creating article");
     //
    //  }
     //
    //  function handleRemoveEntry($event, node) {
    //    $log.info(node);
    //  }
    //  function handleCreateChild($event, node) {
    //    $log.info(node);
    //  }
    //  function handleDeleteNode($event, node) {
    //    $log.info(node);
    //  }
    /* ================================
     * PRIVATE METHODS
     * ================================ */
  }
})();
