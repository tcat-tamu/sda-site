(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('FootnoteEditDialogController', FootnoteEditDialogController);

  /** @ngInject */
  function FootnoteEditDialogController($mdBottomSheet, footnote, references) {
    var vm = this;

    vm.footnote = footnote;
    vm.references = references;

    vm.done = done;
    vm.cancel = cancel;

    function done() {
      $mdBottomSheet.hide();
    }

    function cancel() {
      $mdBottomSheet.cancel();
    }
  }

})();
