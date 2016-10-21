(function () {
  'use strict';

  angular
    .module('sda.concept-browser')
    .controller('HelpDialogController', HelpDialogController);

  /** @ngInject */
  function HelpDialogController($scope, $mdDialog) {
    $scope.close = closeDialog;

    function closeDialog() {
      $mdDialog.hide();
    }
  }

})();
