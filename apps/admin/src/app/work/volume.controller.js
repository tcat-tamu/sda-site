(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ShowVolumeController', ShowVolumeController);

  /** @ngInject */
  function ShowVolumeController($stateParams, worksRepo, relnRepo, $mdDialog, sdaToast, $q, volumeEditDialog, copyEditDialog, summaryEditDialog) {
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
      vm.work = worksRepo.getWork(workId);
      var workPromise = vm.work.$promise;
      workPromise
        .then(extractTitle(['short', 'canonical', 'bibliographic']))
        .then(function (title) { vm.workTitle = title; });

      var editionId = $stateParams.editionId;
      vm.edition = worksRepo.getEdition(workId, editionId);
      var editionPromise = vm.edition.$promise;

      var volumeId = $stateParams.volumeId;
      vm.volume = worksRepo.getVolume(workId, editionId, volumeId);
      var volumePromise = vm.volume.$promise;
      volumePromise
        .then(extractTitle(['canonical', 'bibliographic', 'short']))
        .then(function (title) { vm.title = title; });

      $q.all([workPromise, editionPromise, volumePromise])
        .then(function () {
          vm.anchor = relnRepo.createAnchor(worksRepo.getVolumeLabel(vm.volume, vm.edition.editionName), vm.work.ref.token, {
            editionId: [vm.edition.id],
            volumeId: [vm.volume.id]
          });
        }, function () {
          sdaToast.error('Unable to load bibliographic entry data from server.');
        })
        .then(function () {
          vm.loading = false;
        });
    }

    function extractTitle(preference) {
      return function (biblioObject) {
        return worksRepo.getTitle(biblioObject.titles, preference);
      };
    }

    function editBibInfo($event) {
      var dialogPromise = volumeEditDialog.show($event, angular.copy(vm.volume));

      dialogPromise.then(function (updatedVolume) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        angular.extend(vm.volume, updatedVolume);

        worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast, showErrorToast);
      });

      return dialogPromise;
    }

    function editSummary($event) {
      var dialogPromise = summaryEditDialog.show($event, angular.copy(vm.volume.summary));

      dialogPromise.then(function (updatedSummary) {
        // copy updates back to original only after dialog is positively dismissed (i.e. not canceled)
        vm.volume.summary = updatedSummary;

        worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast, showErrorToast);
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

        worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast, showErrorToast);
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
            worksRepo.saveVolume(vm.work.id, vm.edition.id, vm.volume).then(showSavedToast, showErrorToast);
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
      }).then(showSavedToast, showErrorToast);
    }

    function showSavedToast() {
      return sdaToast.success('Saved');
    }

    function showErrorToast() {
      return sdaToast.error('Unable to save data.');
    }
  }

})();
