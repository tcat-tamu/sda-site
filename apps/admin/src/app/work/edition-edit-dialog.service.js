(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('editionEditDialog', editionEditDialogFactory);

  /** @ngInject */
  function editionEditDialogFactory($mdDialog) {
    return {
      show: showDialog
    };

    function showDialog($event, edition) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/edition-edit-dialog.html',
        locals: {
          edition: edition
        },
        controller: EditionEditDialogController,
        controllerAs: 'vm'
      };

      return $mdDialog.show(dialog);
    }
  }

  /** @ngInject */
  function EditionEditDialogController($mdDialog, edition) {
    var vm = this;

    vm.edition = edition;

    vm.close = close;
    vm.cancel = cancel;
    vm.addAuthor = addAuthor;
    vm.deleteAuthor = deleteAuthor;
    vm.addTitle = addTitle;
    vm.deleteTitle = deleteTitle;

    function close() {
      $mdDialog.hide(vm.edition);
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function addAuthor(field) {
      // TODO delegate creation to worksRepo
      var authorRef = {};
      vm.edition[field].push(authorRef);
    }

    function deleteAuthor(field, authorRef) {
      var ix = vm.edition[field].indexOf(authorRef);
      if (ix >= 0) {
        vm.edition[field].splice(ix, 1);
      }
    }

    function addTitle() {
      // TODO delegate creation to worksRepo
      var title = {};
      vm.edition.titles.push(title);
    }

    function deleteTitle(title) {
      var ix = vm.edition.titles.indexOf(title);
      if (ix >= 0) {
        vm.edition.titles.splice(ix, 1);
      }
    }
  }

})();
