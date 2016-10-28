(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('SummaryEditDialogController', SummaryEditDialogController);

  /** @ngInject */
  function SummaryEditDialogController($mdDialog, summary) {
    var vm = this;

    vm.summary = summary;

    vm.close = close;
    vm.cancel = cancel;

    function close() {
      $mdDialog.hide(vm.summary);
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }

})();
