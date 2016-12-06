(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('TaskController', TaskController);

  /** @ngInject */
  function TaskController($mdSidenav, sdaToast, tasksRepo) {
    var vm = this;

    vm.loading = false;

    vm.openMenu = openMenu;

    activate();

    function activate() {
      vm.loading = true;
      vm.tasks = tasksRepo.all();
      var tasksPromise = vm.tasks.$promise;

      tasksPromise.catch(function () {
        sdaToast.error('Unable to load tasks from server');
      }).then(function () {
        vm.loading = false;
      });
    }

    function openMenu() {
      $mdSidenav('left').toggle();
    }
  }

})();
