(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ShowVolumeController', ShowVolumeController);

  /** @ngInject */
  function ShowVolumeController($stateParams, worksRepo, relnRepo, $mdDialog, $mdToast, $q, volumeEditDialog, copyEditDialog, summaryEditDialog) {
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

      $q.all([vm.work.$promise, vm.edition.$promise, vm.volume.$promise]).then(function () {
        vm.loading = false;

        vm.anchor = relnRepo.createAnchor(worksRepo.getVolumeLabel(vm.volume, vm.edition.editionName), vm.work.ref.token, {
          editionId: [vm.edition.id],
          volumeId: [vm.volume.id]
        });
      });
    }

    function editBibInfo($event) {
      var dialogPromise = volumeEditDialog.show($event, angular.copy(vm.volume));

      dialogPromise.then(function (updatedVolume) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.volume, updatedVolume);

        worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast);
      });

      return dialogPromise;
    }

    function editSummary($event) {
      var dialogPromise = summaryEditDialog.show($event, angular.copy(vm.volume.summary));

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
      var dialogPromise = copyEditDialog.show($event, angular.copy(copy));
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

    function showSavedToast() {
      var toast = $mdToast.simple()
        .textContent('Saved')
        .position('bottom right');

      return $mdToast.show(toast);
    }
  }

})();
