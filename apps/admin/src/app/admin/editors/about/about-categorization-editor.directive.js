(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('aboutCategorizationEditor', aboutCategorizationEditor);

  /** @ngInject */
  function aboutCategorizationEditor() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/admin/editors/about/about-categorization-editor.html',
      scope: {
        scopeId: "@",
        scheme: "@"
      },
      controller: AboutCategorizationEditorController,
      controllerAs: 'vm'
    };

    return directive;
  }

  /** @ngInject */
  function AboutCategorizationEditorController($scope, $mdDialog, sdaToast, $state, $q, articlesRepo, categorizationService) {
    var repo = categorizationService.getScopedRepo($scope.scopeId);

    var vm = this;
    vm.hierarchy = null;
    vm.handleAssociateEntry = handleAssociateEntry;
    vm.handleCreateChild = handleCreateChild;
    vm.handleDeleteNode = handleDeleteNode;

    activate();

    // PUBLIC METHODS

    function handleAssociateEntry($event, node) {
      var type = 'about';
      var title = node.label;

      var page = articlesRepo.create(type, title);
      var pageSavePromise = articlesRepo.save(page);

      var linkPromise = pageSavePromise.then(function (page) {
        var ref = repo.nodes.link(node, {
          id: page.ref.id,
          type: page.ref.type
        });
        return ref.$promise;
      });

      $q.all({
        page: pageSavePromise,
        ref: linkPromise
      }).then(function (params) {
        var page = params.page;
        $state.go('about.edit', { id: page.id });
      });
    }

    /**
     * Handler to be invoked to create a new category with an hierarchical
     * categorization.
     *
     * @param  {event} $event  The event that triggered this request.
     * @param  {object} parent The parent node on which the child should be created.
     * @return {[type]}        [description]
     */
    function handleCreateChild($event, parent) {
      var newCategoryDialog = $mdDialog.prompt({
        targetEvent: $event,
        title: "Enter Category Label",
        placeholder: 'new category',
        ok: "Create",
        cancel: "Cancel"
      });

      var labelPromise = $mdDialog.show(newCategoryDialog)

      labelPromise.then(function (label) {
        repo.nodes.create(parent, label);
      });
    }

    function handleDeleteNode($event, node, parent) {
      var title = 'Delete category \'' + node.label + '\'?';

      var msg = '<p>This will delete the selected category, ' + node.label + ', ' +
        'its sub-categories and all associated articles.' +
        '<em>This action cannot be undone.</em></p>' +
        '<p>Permanently delete this category?</p>';

      var removeCatgorizationDialog = $mdDialog.confirm({
        targetEvent: $event,
        title: title,
        htmlContent: msg,
        ok: "Delete",
        cancel: "Cancel"
      });

      $mdDialog.show(removeCatgorizationDialog).then(function () {
        repo.nodes.remove(node, true, parent).then(function () {
          return sdaToast.success('category deleted');
        }, function () {
          return sdaToast.error('unable to delete category');
        });
      });
    }

    // PRIVATE METHODS

    function activate() {
      vm.hierarchy = repo.get($scope.scheme);
    }

  }

})();
