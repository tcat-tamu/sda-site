(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ShowEditionController', ShowEditionController);

  /** @ngInject */
  function ShowEditionController($state, $stateParams, worksRepo, relnRepo, $mdDialog, $mdToast, $q, editionEditDialog, copyEditDialog, summaryEditDialog) {
    var vm = this;

    vm.loading = true;
    vm.work = null;
    vm.workTitle = null;
    vm.edition = null;
    vm.title = null;

    vm.editBibInfo = editBibInfo;
    vm.editSummary = editSummary;
    vm.addVolume = addVolume;
    vm.deleteVolume = deleteVolume;
    vm.addCopy = addCopy;
    vm.editCopy = editCopy;
    vm.deleteCopy = deleteCopy;
    vm.copyToWork = copyToWork;

    activate();

    function activate() {
      var workId = $stateParams.workId;
      var editionId = $stateParams.editionId;

      vm.work = worksRepo.getWork(workId);
      vm.edition = worksRepo.getEdition(workId, editionId);

      vm.work.$promise.then(function () {
        vm.workTitle = worksRepo.getTitle(vm.work.titles, ['short', 'canonical', 'bibliographic']);
      });

      vm.edition.$promise.then(function () {
        vm.title = worksRepo.getTitle(vm.edition.titles, ['canonical', 'bibliographic', 'short']);
      });

      $q.all([vm.work.$promise, vm.edition.$promise]).then(function (){
        vm.loading = false;

        vm.anchor = relnRepo.createAnchor(worksRepo.getEditionLabel(vm.edition), vm.work.ref.token, {
          editionId: [vm.edition.id]
        });
      });
    }

    function editBibInfo($event) {
      var dialogPromise = editionEditDialog.show($event, angular.copy(vm.edition));

      dialogPromise.then(function (updatedEdition) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.edition, updatedEdition);

        worksRepo.saveEdition(vm.work.id, vm.edition).then(showSavedToast);
      });

      return dialogPromise;
    }

    function editSummary($event) {
      var dialogPromise = summaryEditDialog.show($event, angular.copy(vm.edition.summary));

      dialogPromise.then(function (updatedSummary) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        vm.edition.summary = updatedSummary;

        worksRepo.saveEdition(vm.work.id, vm.edition).then(showSavedToast);
      });
    }

    function addVolume($event) {
      var prompt = $mdDialog.prompt()
        .targetEvent($event)
        .title('Create Volume')
        .textContent('Please provide a number for the new volume.')
        .placeholder('volume number')
        .ok('Create')
        .cancel('Cancel');

      var dialogPromise = $mdDialog.show(prompt);

      var savePromise = dialogPromise.then(function (volumeNumber) {
        var volume = worksRepo.createVolume();
        volume.volumeNumber = volumeNumber;
        volume.titles = angular.copy(vm.edition.titles);
        volume.authors = angular.copy(vm.edition.authors);
        volume.publicationInfo = angular.copy(vm.edition.publicationInfo);

        vm.edition.volumes.push(volume);

        return worksRepo.saveVolume(vm.work.id, vm.edition.id, volume);
      });

      savePromise.then(showSavedToast);

      savePromise.then(function (volume) {
        $state.go('editor.volume', { workId: vm.work.id, editionId: vm.edition.id, volumeId: volume.id });
      });
    }

    function deleteVolume(volume, $event) {
      var confirm = $mdDialog.confirm()
        .targetEvent($event)
        .title('Confirm Deletion')
        .textContent('Are you sure you want to delete this volume?')
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm)
        .then(function () {
          var ix = vm.edition.volumes.indexOf(volume);
          if (ix >= 0) {
            vm.edition.volumes.splice(ix, 1);
            worksRepo.saveEdition(vm.work.id, vm.edition).then(showSavedToast);
          }
        });
    }

    function addCopy($event) {
      var copy = {};
      editCopy(copy, $event).then(function () {
        vm.edition.copies.push(copy);
      });
    }

    function editCopy(copy, $event) {
      var dialogPromise = copyEditDialog.show($event, angular.copy(copy));
      dialogPromise.then(function (updatedCopy) {
        // copy updates back to original only after dialog is positively dismised (i.e. not canceled)
        angular.extend(copy, updatedCopy);

        worksRepo.saveEdition(vm.work.id, vm.edition).then(showSavedToast);
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
          var ix = vm.edition.copies.indexOf(copy);
          if (ix >= 0) {
            vm.edition.copies.splice(ix, 1);
            worksRepo.saveEdition(vm.work.id, vm.edition).then(showSavedToast);
          }
        });
    }

    function copyToWork(origCopy) {
      var newCopy = angular.copy(origCopy);
      newCopy.id = null;

      // HACK: make sure we have an up-to-date copy of the edition before updating it
      var work = worksRepo.getWork(vm.work.id);
      work.$promise.then(function () {
        work.copies.push(newCopy);
        return worksRepo.saveWork(work);
      }).then(showSavedToast);
    }

    function showSavedToast() {
      var toast = $mdToast.simple()
        .textContent('Saved')
        .position('bottom right');

      return $mdToast.show(toast);
    }
  }

})();
