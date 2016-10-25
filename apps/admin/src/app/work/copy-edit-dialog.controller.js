(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('CopyEditDialogController', CopyEditDialogController);

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
