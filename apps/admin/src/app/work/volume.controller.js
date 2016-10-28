(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ShowVolumeController', ShowVolumeController);

  /** @ngInject */
  function ShowVolumeController($state, $stateParams, worksRepo, relnRepo, _, $mdDialog, $mdToast, $q, $timeout) {
    var vm = this;

    vm.loading = true;
    vm.work = null;
    vm.workTitle = null;
    vm.edition = null;
    vm.volume = null;
    vm.title = null;

    vm.editBibInfo = editBibInfo;
    vm.editSummary = editSummary;
    vm.addCopy = addCopy;
    vm.editCopy = editCopy;
    vm.deleteCopy = deleteCopy;
    vm.copyToEdition = copyToEdition;
    vm.openRelationship = openRelationship;
    vm.addRelationship = addRelationship;
    vm.deleteRelationship = deleteRelationship;

    activate();

    function activate() {
      var workId = $stateParams.workId
      var editionId = $stateParams.editionId;
      var volumeId = $stateParams.volumeId;

      vm.work = worksRepo.getWork(workId);
      vm.edition = worksRepo.getEdition(workId, editionId);
      vm.volume = worksRepo.getVolume(workId, editionId, volumeId);

      vm.work.$promise.then(function () {
        vm.workTitle = worksRepo.getTitle(vm.work.titles, ['short', 'canonical', 'bibliographic']);
      });

      vm.volume.$promise.then(function () {
        vm.title = worksRepo.getTitle(vm.volume.titles, ['canonical', 'bibliographic', 'short']);
      });

      var relationshipsPromise = loadRelationships();

      $q.all([vm.work.$promise, vm.edition.$promise, vm.volume.$promise, relationshipsPromise]).then(function () {
        vm.loading = false;
      });
    }

    function getCurrentUri() {
      var workId = $stateParams.workId;
      var editionId = $stateParams.editionId;
      var volumeId = $stateParams.volumeId;
      return 'works/' + workId + '/editions/' + editionId + '/volumes/' + volumeId;
    }

    function loadRelationships() {

      vm.relationships = [];
      var currentUri = getCurrentUri();
      var relationships = relnRepo.search(currentUri);
      relationships.$promise.then(function () {
        vm.relationships = relnRepo.normalizeRelationships(relationships, currentUri, worksRepo);
      });
    }

    function editBibInfo($event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/volume-edit-dialog.html',
        locals: {
          // create a copy for manipulation
          volume: angular.copy(vm.volume)
        },
        controller: 'VolumeEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (updatedVolume) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.volume, updatedVolume);

        worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast);
      });

      return dialogPromise;
    }

    function editSummary($event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/components/summary-edit-dialog/summary-edit-dialog.html',
        locals: {
          // create a copy for manipulation (even if it is just a string)
          summary: angular.copy(vm.volume.summary)
        },
        controller: 'SummaryEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (updatedSummary) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        vm.volume.summary = updatedSummary;

        worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast);
      });
    }

    function addCopy($event) {
      var copy = {};
      editCopy(copy, $event).then(function () {
        vm.volume.copies.push(copy);
      });
    }

    function editCopy(copy, $event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/copy-edit-dialog.html',
        locals: {
          // create a copy for manipulation
          copy: angular.copy(copy)
        },
        controller: 'CopyEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (updatedCopy) {
        // copy updates back to original only after dialog is positively dismised (i.e. not canceled)
        angular.extend(copy, updatedCopy);

        worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast);
      });

      return dialogPromise;
    }

    function deleteCopy(copy, $event) {
      var confirm = $mdDialog.confirm()
        .targetEvent($event)
        .title('Confirm Deletion')
        .textContent('Are you sure you want to delete this copy?')
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm)
        .then(function () {
          var ix = vm.volume.copies.indexOf(copy);
          if (ix >= 0) {
            vm.volume.copies.splice(ix, 1);
            worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast);
          }
        });
    }

    function copyToEdition(origCopy) {
      var newCopy = angular.copy(origCopy);
      newCopy.id = null;

      // HACK: make sure we have an up-to-date copy of the edition before updating it
      var edition = worksRepo.getEdition(vm.work.id, vm.edition.id);
      edition.$promise.then(function () {
        edition.copies.push(newCopy);
        return worksRepo.saveEdition(vm.work.id, edition);
      }).then(showSavedToast);
    }

    function openRelationship(relationship) {
      // HACK just working with first entity
      var entity = relationship.entities[0];
      $state.go('editor.' + entity.type, entity.refParams);
    }

    function addRelationship($event) {
      var relationship = relnRepo.createRelationship();

      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/relationship-edit-dialog.html',
        locals: {
          // create a copy for manipulation
          relationship: angular.copy(relationship),
          currentUri: getCurrentUri()
        },
        controller: 'RelationshipEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      var savePromise = dialogPromise.then(function (updatedRelationship) {
        // copy updates back to original only after dialog is positively dismised (i.e. not canceled)
        angular.extend(relationship, updatedRelationship);

        return relnRepo.save(relationship);
      });

      savePromise.then(showSavedToast);

      savePromise.then(function () {
        // HACK give relationships a chance to save on the server
        $timeout(loadRelationships, 1000);
      });
    }

    function deleteRelationship(relationship, $event) {
      var confirm = $mdDialog.confirm()
        .targetEvent($event)
        .title('Confirm Deletion')
        .textContent('Are you sure you want to delete this relationship?')
        .ok('Yes')
        .cancel('No');

      var confirmPromise = $mdDialog.show(confirm);
      var deletePromise = confirmPromise.then(function () {
        return relnRepo.delete(relationship.id);
      });

      deletePromise.then(showSavedToast);

      deletePromise.then(function () {
        // HACK give relationships a chance to save on the server
        $timeout(loadRelationships, 1000);
      });
    }

    function showSavedToast() {
      var toast = $mdToast.simple()
        .textContent('Saved')
        .position('bottom right');

      return $mdToast.show(toast);
    }
  }

})();
