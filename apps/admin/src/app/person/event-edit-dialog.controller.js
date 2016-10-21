(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('EventEditDialogController', EventEditDialogController);

  /** @ngInject */
  function EventEditDialogController($mdDialog, event) {
    var vm = this;

    vm.event = event;

    vm.close = close;
    vm.cancel = cancel;

    function close() {
      $mdDialog.hide(vm.event);
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }

})();
