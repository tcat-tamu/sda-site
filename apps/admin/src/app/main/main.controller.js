(function() {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(worksRepo, peopleRepo, $state, $stateParams, $mdSidenav, _, $q, $mdDialog, sdaToast) {
    var vm = this;

    vm.loading = false;
    vm.searchQuery = '';

    vm.openMenu = openMenu;
    vm.createPerson = createPerson;
    vm.createWork = createWork;
    vm.search = _.debounce(search, 300);

    activate();

    function activate() {
      if ($stateParams.q) {
        vm.searchQuery = $stateParams.q;
        search(vm.searchQuery);
      }
    }

    function openMenu() {
      $mdSidenav('left').toggle();
    }

    function search(query) {
      vm.loading = true;

      vm.peopleResults = peopleRepo.search(query);
      vm.worksResults = worksRepo.search(query);

      $q.all([
        vm.peopleResults.$promise,
        vm.worksResults.$promise
      ])
        .then(function () {
          vm.loading = false;
        }, function () {
          sdaToast.error('Unable to load data from the server');
        });
    }

    function createPerson($event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/person/person-edit-dialog.html',
        locals: {
          person: peopleRepo.create()
        },
        controller: 'PersonEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (person) {
        var savePromise = peopleRepo.save(person);

        savePromise.then(showSavedToast, showErrorToast);

        savePromise.then(function (person) {
          $state.go('editor.person', { id: person.id });
        });

        return savePromise;
      });

    }

    function createWork($event) {
      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/work-edit-dialog.html',
        locals: {
          work: worksRepo.createWork()
        },
        controller: 'WorkEditDialogController',
        controllerAs: 'vm'
      };

      var dialogPromise = $mdDialog.show(dialog);

      dialogPromise.then(function (work) {
        var savePromise = worksRepo.saveWork(work);

        savePromise.then(showSavedToast, showErrorToast);

        savePromise.then(function (work) {
          $state.go('editor.work', { workId: work.id });
        });

        return savePromise;
      });
    }

    function showSavedToast() {
      return sdaToast.success('Saved.');
    }

    function showErrorToast() {
      return sdaToast.error('Unable to save.')
    }
  }
})();
