(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('CitationEditDialogController', CitationEditDialogController);

  /** @ngInject */
  function CitationEditDialogController($mdDialog, references, citation) {
    var vm = this;

    vm.references = references;
    vm.citation = citation;

    vm.done = done;
    vm.cancel = cancel;

    function done() {
      $mdDialog.hide();
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }

})();
