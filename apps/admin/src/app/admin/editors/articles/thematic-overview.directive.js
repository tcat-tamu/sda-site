(function () {
   'use strict';

   angular
      .module('sdaAdmin')
      .directive('treeCategorizationEditor', treeCategorizationEditor);

   /** @ngInject */
   function treeCategorizationEditor() {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/admin/editors/articles/thematic-overview.html',
         scope: {
           scopeId: "@",
           scheme: "@"
          //  need param to indicate whether this categorization owns related entrties
         },
         controller: TreeCategorizationController,
         controllerAs: 'vm'
      };

      return directive;
   }

   // NOTE this needs to move toward being a more general puropose control

   /** @ngInject */
   function TreeCategorizationController($scope, $log, $mdDialog, sdaToast, $state, $q,
     articlesRepo, categorizationService) {

     var vm = this;
     var repo = null;

     // TODO need to allow actions to be pluggable
     vm.handleAssociateEntry = handleAssociateEntry;
     vm.handleRemoveEntry = handleRemoveEntry;
     vm.handleCreateChild = handleCreateChild;
     vm.handleDeleteNode = handleDeleteNode;

     activate();

     //'overviews'
     function activate() {
       $log.info("Loading article editor", articlesRepo);
       repo = categorizationService.getScopedRepo($scope.scopeId);
       // TODO need to handle case when this fails to load. Display throbber pending load
       vm.overviews = repo.get($scope.scheme);
     }

     // TODO allow edit labels

     /* ================================
      * API METHODS
      * ================================ */
      function handleAssociateEntry($event, node) {
        $log.info("creating article");
        // TODO need to offer option of create or link
        // TODO magic string

        var type = 'thematic';
        var title = node.label;

        // TODO  display prompt dialog, allow entry of title, selection of type (but not)
        // TODO error handling!!
        var article = articlesRepo.create(type, title);
        var articlePromise = articlesRepo.save(article);
        var linkPromise = articlePromise.then(linkArticle);

        $q.all({
          article: articlePromise,
          ref: linkPromise
        }).then(openEditor);

        function linkArticle(article) {
          var ref = repo.nodes.link(node, {
            id: article.ref.id,
            type: article.ref.type
          });
          return ref.$promise;
        }

        function openEditor(values) {
          $state.go("article.edit", {
            id: values.article.id
          });
        }
        // TODO creates article and (once created) associates
        //      that article with this node in the hierarchy.
        //      On completion, opens that article in the editor.
      }

      function handleRemoveEntry($event, node) {
        $log.info("Removing entry", node);


        // TODO Prompts for confirmation to notify user that changes
        //      cannot be reverted.
        //      If OK, removes the associated entry from this node
        //      and then deletes the article.

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
        $log.info(parent);

        var newCategoryDialog = $mdDialog.prompt({
          title: "Enter Category Label",
          // TODO add description
          placeholder: 'new category',
          ok: "Create",
          cancel: "Cancel",
          targetEvent: $event
        });

        $mdDialog.show(newCategoryDialog)
                 .then(onCreate);

        function onCreate(label) {
          $log.info("Creating category " + label);

          repo.nodes.create(parent, label);
        }
      }

      function handleDeleteNode($event, node, parent) {
        $log.info(node);

        var title = "Delete category '" + node.label + "'";
        var msg = "<p>This will delete the selected category, " + node.label + ", " +
                  "its sub-categories and all associated articles." +
                  "<em>This action cannot be undone.</em></p>" +
                  "<p>Permanently delete this category?</p>";
        var removeCatgorizationDialog = $mdDialog.confirm({
          title: title,
          htmlContent: msg,
          ok: "Delete",
          cancel: "Cancel",
          targetEvent: $event
        });

        $mdDialog.show(removeCatgorizationDialog).then(function() {
           // TODO dispaly success/failure toasts
           repo.nodes.remove(node, true, parent).then(function () {
             return sdaToast.success('category deleted');
           }, function () {
             return sdaToast.error('unable to delete category');
           });
         });


        function deleteNode() {
        }

        // TODO Prompts for confirmation to notify user that changes
        //      cannot be reverted.
        //      Recursively removes all articles associated with descendants
        //      Removes this categorization entry (and children)
      }

      /* ================================
       * PRIVATE METHODS
       * ================================ */

       function getChildren(node) {
         if (node.childIds.length != node.chilren.length) {
           throw new Error("Lazy loading of children not yet supported.");
         }

         return $q.when(node.chilren);
       }

   }

})();
