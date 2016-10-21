(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .component('navbar', {
      templateUrl: 'app/components/navbar/navbar.html',
      bindings: {
        title: '@',
        sidenavId: '@?'
      },
      controller: NavbarController
    });

  /** @ngInject */
  function NavbarController($mdSidenav) {
    var vm = this;

    vm.toggleSidenav = toggleSidenav;

    activate();

    function activate() {

    }

    function toggleSidenav(id) {
      $mdSidenav(id).toggle();
    }
  }

})();
