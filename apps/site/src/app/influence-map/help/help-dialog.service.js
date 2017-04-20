(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .factory('helpDialog', helpDialogServiceFactory);

  /** @ngInject */
  function helpDialogServiceFactory($mdDialog, $mdMedia) {
    return {
      show: show
    };

    function show($event) {
      var config = {
        targetEvent: $event,
        fullscreen: $mdMedia('sm') || $mdMedia('xs'),
        templateUrl: 'app/influence-map/help/help.html',
        controller: HelpDialogController,
        clickOutsideToClose: true
      };

      $mdDialog.show(config)
    }
  }

  /** @ngInject */
  function HelpDialogController($scope, $mdDialog) {
    $scope.close = closeDialog;

    function closeDialog() {
      $mdDialog.hide();
    }
  }

})();
