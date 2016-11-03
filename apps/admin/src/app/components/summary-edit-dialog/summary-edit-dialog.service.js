(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('summaryEditDialog', summaryEditDialogFactory);

  /** @ngInject */
  function summaryEditDialogFactory($mdDialog) {
    return {
      show: showDialog
    };

    function showDialog($event, summary) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/components/summary-edit-dialog/summary-edit-dialog.html',
        locals: {
          summary: summary
        },
        controller: SummaryEditDialogController,
        controllerAs: 'vm'
      };

      return $mdDialog.show(dialog);
    }
  }

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
