(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('TaskController', TaskController);

  /** @ngInject */
  function TaskController($mdSidenav, $mdToast, tasksRepo) {
    var vm = this;

    vm.loading = false;

    vm.openMenu = openMenu;

    activate();

    function activate() {
      vm.loading = true;
      vm.tasks = tasksRepo.all();

      vm.tasks.$promise.then(function () {
        vm.loading = false;
      }, function () {
        vm.loading = false;
        $mdToast.show($mdToast.simple().textContent('Unable to load tasks from server'));
      });
    }

    function openMenu() {
      $mdSidenav('left').toggle();
    }
  }

})();
