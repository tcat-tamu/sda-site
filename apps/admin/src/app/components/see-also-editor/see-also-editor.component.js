(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .component('seeAlsoEditor', {
      templateUrl: 'app/components/see-also-editor/see-also-editor.html',
      bindings: {
        sourceToken: '<'
      },
      controller: SeeAlsoEditorController
    });

  // emulation of an enum
  var TypeId = {
    WORK: 'trc.entries.bibliographic',
    PERSON: 'trc.entries.biographical',
    ARTICLE: 'trc.entries.article'
  };

  var UNIFIED_SEARCH_KEYS = ['people', 'works', 'articles'];

  /** @ngInject */
  function SeeAlsoEditorController($scope, $state, $mdDialog, $mdToast, _, seeAlsoRepo, trcSearch) {
    var vm = this;

    vm.loading = false;
    vm.seeAlso = null;

    vm.searchText = null;
    vm.selectedItem = null;

    vm.createLink = createLink;
    vm.openLink = openLink;
    vm.deleteLink = deleteLink;
    vm.search = search;

    activate();

    // PUBLIC METHODS

    /**
     * Creates a new see-also link with the current token as the source
     * and the given anchor as the target.
     * @param {Anchor} anchor
     */
    function createLink(anchor) {
      if (alreadyLinked(anchor)) {
        $mdToast.showSimple('Item has already been linked.');
        clearLinkForm();
        return;
      }

      var link = seeAlsoRepo.create(vm.sourceToken, anchor.token);

      link.$promise.then(function () {
        // HACK: link to target comes back as source field
        var anchor = link.source;
        if (!vm.seeAlso.links.hasOwnProperty(anchor.type)) {
          vm.seeAlso.links[anchor.type] = [];
        }

        vm.seeAlso.links[anchor.type].push(anchor);

        clearLinkForm();

        $mdToast.showSimple('Link created');
      }, function () {
        $mdToast.showSimple('Unable to create link');
      });
    }

    /**
     * Redirects the browser to the editor page for the item referenced by the given anchor.
     * @param {MouseEvent} $event
     * @param {Anchor} anchor
     */
    function openLink($event, anchor) {
      var state = null;
      var params = {};

      switch(anchor.type) {
        case TypeId.WORK:
          state = 'editor.work';
          params.workId = anchor.id;
          break;
        case TypeId.PERSON:
          state = 'editor.person';
          params.id = anchor.id;
          break;
        case TypeId.ARTICLE:
          state = 'article.edit';
          params.id = anchor.id;
          break;
        default:
          break;
      }

      if (!state) {
        $mdToast.showSimple('I don\'t know how to follow that link.');
      } else {
        $state.go(state, params);
      }
    }

    /**
     * Reoves the see-also link targeted by the given anchor.
     * @param {MouseEvent} $event
     * @param {Anchor} anchor
     */
    function deleteLink($event, anchor) {
      var dialog = $mdDialog.confirm({
        targetEvent: $event,
        title: 'Confirm Deletion',
        htmlContent: 'Are you sure you want to delete this link?' + anchor.label,
        ok: 'Yes',
        cancel: 'No'
      });

      var confirmP = $mdDialog.show(dialog);

      confirmP.then(function () {
        var deleteP = seeAlsoRepo.delete(vm.sourceToken, anchor.token);

        deleteP.then(function () {
          $mdToast.showSimple('Link deleted');
          var ix = vm.seeAlso.links[anchor.type].indexOf(anchor);
          if (ix >= 0) {
            vm.seeAlso.links[anchor.type].splice(ix, 1);
          }
        }, function () {
          $mdToast.showSimple('Unable to delete link');
        })
      });
    }

    /**
     * Searches all entries matching the provided query.
     * @param  {string} query
     * @return {Promise.<Anchor[]>}
     */
    function search(query) {
      var results = trcSearch.search(query);
      return results.$promise.then(combineSearchResults);
    }

    // PRIVATE METHODS

    /**
     * Initializes controller state
     */
    function activate() {
      $scope.$watch('$ctrl.sourceToken', function (newToken) {
        if (!newToken) {
          return;
        }

        vm.loading = true;
        vm.seeAlso = seeAlsoRepo.get(newToken);
        vm.seeAlso.$promise.then(function () {
          vm.loading = false;
        });
      });
    }

    /**
     * Determines whether the proided anchor has already been linked with the current token.
     * @param {Anchor} anchor
     * @return {boolean}
     */
    function alreadyLinked(anchor) {
      return vm.seeAlso.links[anchor.type].some(function (existing) {
        return existing.token === anchor.token;
      });
    }

    /**
     * Clears the new link input form.
     */
    function clearLinkForm() {
      vm.searchText = null;
      vm.selectedItem = null;
    }

    /**
     * Combines unified search results into a homogeneous list of anchors.
     * @param {UnifiedSearchResult} results
     * @return {Anchor[]}
     */
    function combineSearchResults(results) {
      return _.flatMap(UNIFIED_SEARCH_KEYS, function (key) {
        return results.results[key].map(function (item) {
          return {
            label: item.label || item.title,  // article search results don't have a 'label' attribute
            type: item.ref.type,
            token: item.ref.token
          };
        });
      });
    }
  }

})();
