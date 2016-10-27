(function() {
  'use strict';

  angular
    .module('sdaBookReader')
    .controller('BookReaderController', BookReaderController);

  /** @ngInject */
  function BookReaderController($timeout, $rootScope, copyRef, work, relns) {
    var vm = this;

    vm.copyRef = copyRef;
    vm.work = work;
    vm.relns = relns;
    vm.lockSidebar = true;

    vm.toggleSidenav = toggleSidenav;

    function toggleSidenav() {
      vm.lockSidebar = !vm.lockSidebar;

      // HACK: need to tell book reader to refresh its size
      $timeout(function () {
        $rootScope.$broadcast('resize');
      }, 500);
    }

  }
})();
