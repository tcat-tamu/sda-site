(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .controller('HelpDialogController', HelpDialogController);

  /** @ngInject */
  function HelpDialogController($scope, $mdDialog) {
    $scope.close = closeDialog;

    function closeDialog() {
      $mdDialog.hide();
    }
  }

})();
