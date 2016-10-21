(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('VolumeEditDialogController', VolumeEditDialogController);

  /** @ngInject */
  function VolumeEditDialogController($mdDialog, volume) {
    var vm = this;

    vm.volume = volume;

    vm.close = close;
    vm.cancel = cancel;
    vm.addAuthor = addAuthor;
    vm.deleteAuthor = deleteAuthor;
    vm.addTitle = addTitle;
    vm.deleteTitle = deleteTitle;

    function close() {
      $mdDialog.hide(vm.volume);
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function addAuthor(field) {
      // TODO delegate creation to worksRepo
      var authorRef = {};
      vm.volume[field].push(authorRef);
    }

    function deleteAuthor(field, authorRef) {
      var ix = vm.volume[field].indexOf(authorRef);
      if (ix >= 0) {
        vm.volume[field].splice(ix, 1);
      }
    }

    function addTitle() {
      // TODO delegate creation to worksRepo
      var title = {};
      vm.volume.titles.push(title);
    }

    function deleteTitle(title) {
      var ix = vm.volume.titles.indexOf(title);
      if (ix >= 0) {
        vm.volume.titles.splice(ix, 1);
      }
    }
  }

})();
