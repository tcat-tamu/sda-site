(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .component('relationships', {
      templateUrl: 'app/work/components/relationships/relationships.html',
      bindings: {
        anchor: '<'
      },
      controller: RelationshipsController
    });

  // emulation of an enum
  // HACK: this code is copied from the see-also-editor component
  var TypeId = {
    WORK: 'trc.entries.bibliographic',
    PERSON: 'trc.entries.biographical',
    ARTICLE: 'trc.entries.article'
  };


  /** @ngInject */
  function RelationshipsController($scope, $state, $timeout, $mdDialog, sdaToast, _, relnRepo, relnEditDialog) {
    var vm = this;

    vm.typeGroups = null;

    vm.openRelationship = openRelationship;
    vm.addRelationship = addRelationship;
    vm.deleteRelationship = deleteRelationship;

    activate();

    // PUBLIC METHODS

    function openRelationship($event, reln) {
      // HACK: only using first anchor
      var anchor = reln.anchors[0];

      var state = null;
      var params = {};

      switch(anchor.ref.type) {
        case TypeId.WORK:
          state = 'editor.work';
          params.workId = anchor.ref.id;

          if (anchor.properties.editionId) {
            state = 'editor.edition';
            params.editionId = anchor.properties.editionId;
          }

          if (anchor.properties.editionId && anchor.properties.volumeId) {
            state = 'editor.volume';
            params.volumeId = anchor.properties.volumeId;
          }

          break;
        case TypeId.PERSON:
          state = 'editor.person';
          params.id = anchor.ref.id;
          break;
        case TypeId.ARTICLE:
          state = 'article.edit';
          params.id = anchor.ref.id;
          break;
        default:
          break;
      }

      if (!state) {
        sdaToast.error('I don\'t know how to follow that link.');
      } else {
        $state.go(state, params);
      }
    }

    function addRelationship($event) {
      var relationship = relnRepo.createRelationship();

      var dialogPromise = relnEditDialog.show($event);
      dialogPromise.then(function (relnInfo) {
        relationship.typeId = relnInfo.typeId;
        relationship.description = relnInfo.description;

        /*
        determine fields in which to place anchors...

        directed | reverse || destination for self anchor | destination for selected anchor
        ---------|---------||-----------------------------|--------------------------------
        NO       | *       || "related"                   | "related"
        YES      | YES     || "targets"                   | "related"
        YES      | NO      || "related"                   | "targets"
         */
        if (!relnInfo.directed) {
          relationship.related.push(vm.anchor);
          relationship.related.push(relnInfo.target);
        } else if (relnInfo.reverse) {
          relationship.targets.push(vm.anchor);
          relationship.related.push(relnInfo.target);
        } else {
          relationship.related.push(vm.anchor);
          relationship.targets.push(relnInfo.target);
        }

        var saveP = relnRepo.save(relationship);
        saveP.then(function () {
          sdaToast.success('Saved.');
          // HACK give relationship a chance to save on the server
          $timeout(loadRelationships, 1000);
        }, function () {
          sdaToast.error('Unable to save relationship');
        });
      });

    }

    function deleteRelationship($event, reln) {
      var confirm = $mdDialog.confirm()
        .targetEvent($event)
        .title('Confirm Deletion')
        .textContent('Are you sure you want to delete this relationship?')
        .ok('Yes')
        .cancel('No');

      var confirmPromise = $mdDialog.show(confirm);
      confirmPromise.then(function () {
        var deleteP = relnRepo.delete(reln.id);

        deleteP.then(function () {
          sdaToast.success('Relationship deleted.');
          // HACK give relationship a chance to be deleted from the server
          $timeout(loadRelationships, 1000);
        }, function () {
          sdaToast.error('Unable to delete relationship');
        });
      });
    }

    // PRIVATE METHODS

    function activate() {
      $scope.$watch('$ctrl.anchor', function (newAnchor) {
        if (!newAnchor) {
          return;
        }

        loadRelationships();
      });
    }

    /**
     * Loads relationships from the repository using the currently bound anchor.
     * @return {Promise.<TypeGroup[]>}
     */
    function loadRelationships() {
      vm.loading = true;
      var relns = relnRepo.search(vm.anchor.ref, vm.anchor.properties);

      var typeGroupsP = relns.$promise.then(function () {
        vm.typeGroups = relnRepo.normalizeRelationships(relns, vm.anchor.ref);
        return vm.typeGroups.$promise;
      })

      typeGroupsP.catch(function () {
        sdaToast.error('Unable to load relationship data from the server');
      }).then(function () {
        vm.loading = false;
      });


      return typeGroupsP;
    }
  }


})();
