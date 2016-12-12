(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .controller('WorkspaceController', WorkspaceController);

  /** @ngInject */
  function WorkspaceController(panelContentMediatorRegistry, workspaceRepository, $stateParams, $log, $scope, $timeout, $mdSidenav, $mdToast, hotkeys, _, $q, peopleRepo, worksRepo) {
    var vm = this;

    vm.workspace = null;

    vm.activeItems = [];
    vm.searchQuery = '';
    vm.sidebarFocused = true;

    vm.search = _.debounce(search, 300);

    activate();

    function activate() {
      // lookup workspace by id || get first workspace || create new workspace
      var workspaceIdP = $stateParams.workspaceId
        ? $q.when($stateParams.workspaceId)
        : workspaceRepository.listWorkspaceIds().then(function (ids) {
          return ids.length > 0 ? ids[0] : null;
        });

      var workspaceP = workspaceIdP
        .then(function (id) {
          return workspaceRepository.getWorkspace(id);
        })
        .catch(function () {
          return workspaceRepository.createWorkspace();
        });

      workspaceP.then(function (workspace) {
        vm.workspace = workspace;
      });

      hotkeys.bindTo($scope)
        .add({
          combo: 'ctrl+\\',
          description: 'Toggle Sidebar',
          callback: function () {
            vm.sidebarFocused = !vm.sidebarFocused;
          }
        })
        .add({
          combo: '/',
          description: 'Search',
          callback: function () {
            vm.searchQuery = '';
            if (vm.sidebarFocused) {
              $timeout(function () {
                // prevent key event from typing in field
                angular.element('#searchQuery').focus();
              });
            } else {
              $mdSidenav('left').toggle();
            }
          }
        })
        .add({
          combo: 'n',
          description: 'Create a new note panel',
          callback: function () {
            createNotePanel(100, 100);
          }
        });
    }

    function search(query) {
      vm.loading = true;

      // TODO delegate to registered external search/content providers

      vm.peopleResults = peopleRepo.search(query);
      vm.worksResults = worksRepo.search(query);

      function tagAll(key, value) {
        return function (arr) {
          arr.forEach(function (obj) {
            obj[key] = value;
          });
          return arr;
        };
      }

      $q.all([
        vm.peopleResults.$promise.then(_.property('items')).then(tagAll('type', 'person')),
        vm.worksResults.$promise.then(_.property('items')).then(tagAll('type', 'work'))
      ])
        .then(function () {
          vm.loading = false;
        }, function () {
          $mdToast.showSimple('Unable to load search results');
        });
    }

    /**
     * Creates a new note panel at the desired position
     * @param {integer} x
     * @param {integer} y
     */
    function createNotePanel(x, y) {
      var note = {
        note: ''
      };

      var context = {
        xPosition: x,
        yPosition: y
      };

      var contentMediators = panelContentMediatorRegistry.findContentMediators(note, context);
      var mediator = contentMediators.length > 0 ? contentMediators[0] : null;
      vm.workspace.createPanel(mediator, note, context);
    }
  }

})();
