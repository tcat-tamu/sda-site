(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('eventEditDialog', eventEditDialogFactory);

  /** @ngInject */
  function eventEditDialogFactory($mdDialog) {
    return {
      show: showDialog
    };

    function showDialog($event, event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/person/components/event-edit-dialog/event-edit-dialog.html',
        locals: {
          event: event
        },
        controller: EventEditDialogController,
        controllerAs: 'vm'
      };

      return $mdDialog.show(dialog);
    }
  }

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
