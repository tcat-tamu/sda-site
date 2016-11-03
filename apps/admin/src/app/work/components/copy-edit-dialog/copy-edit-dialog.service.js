(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('copyEditDialog', copyEditDialogFactory);

  /** @ngInject */
  function copyEditDialogFactory($mdDialog) {
    return {
      show: showDialog
    };

    function showDialog($event, copy) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/components/copy-edit-dialog/copy-edit-dialog.html',
        locals: {
          copy: copy
        },
        controller: CopyEditDialogController,
        controllerAs: 'vm'
      };

      return $mdDialog.show(dialog);
    }
  }

  /** @ngInject */
  function CopyEditDialogController($mdDialog, copy) {
    var vm = this;

    vm.copy = copy;

    vm.close = close;
    vm.cancel = cancel;

    function close() {
      $mdDialog.hide(vm.copy);
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }

})();
