(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('volumeEditDialog', volumeEditDialogFactory);

  /** @ngInject */
  function volumeEditDialogFactory($mdDialog) {
    return {
      show: showDialog
    };

    function showDialog($event, volume) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/volume-edit-dialog.html',
        locals: {
          volume: volume
        },
        controller: VolumeEditDialogController,
        controllerAs: 'vm'
      };

      return $mdDialog.show(dialog);
    }
  }

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
