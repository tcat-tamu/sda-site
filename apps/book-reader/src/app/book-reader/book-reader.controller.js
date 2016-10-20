(function() {
  'use strict';

  angular
    .module('sdaBookReader')
    .controller('BookReaderController', BookReaderController);

  /** @ngInject */
  function BookReaderController($stateParams, $mdSidenav, worksRepo) {
    var workId = $stateParams.workId;
    var editionId = $stateParams.editionId;
    var volumeId = $stateParams.volumeId;
    var copyId = $stateParams.copyId;

    var vm = this;

    vm.toggleSidenav = toggleSidenav;
    vm.loading = false;

    activate();

    function activate() {
      vm.loading = true;
      vm.copyRef = worksRepo.getDigitalCopy(copyId, workId, editionId, volumeId);
      vm.copyRef.$promise.then(function () {
        vm.loading = false;
      }, function () {
        vm.loading = false;
      });
    }

    function toggleSidenav(id) {
      $mdSidenav(id).toggle();
    }

  }
})();
