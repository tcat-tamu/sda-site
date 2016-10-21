(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('ShowTaskController', ShowTaskController);

  /** @ngInject */
  function ShowTaskController($state, $stateParams, $mdSidenav, tasksRepo, $q) {
    var vm = this;

    // HACK this will eventually be made available on the workflow data model itself.
    vm.stageOrder = [
      'pinned',
      'inprogress',
      'review',
      'pending',
      'deferred'
    ];

    vm.loading = true;
    vm.worklists = {};
    vm.task = null;

    vm.focusItem = focusItem;
    vm.transition = transitionItem;

    activate();

    function activate() {
      vm.taskId = $stateParams.taskId;
      vm.task = tasksRepo.getTask(vm.taskId);
      vm.workflow = tasksRepo.getWorkflow(vm.taskId);

      vm.workflow.$promise.then(function () {
        var worklistPromises = [];

        angular.forEach(vm.workflow.stages, function (stage) {
          var worklistPromise = fetchStage(stage.id);
          worklistPromises.push(worklistPromise);
        });

        $q.all(worklistPromises).then(function () {
          vm.loading = false;
        });
      });
    }

    function focusItem(item, $event) {
      $event.stopImmediatePropagation();

      // TODO resolve handler based on item.type
      $state.go('editor.work', { workId: item.entityId });
    }

    function transitionItem(item, transition, $event) {
      $event.stopImmediatePropagation();

      var updatedItem = tasksRepo.transition(vm.taskId, item, transition);
      updatedItem.$promise.then(function () {
        fetchStage(transition.sourceStage);
        fetchStage(transition.targetStage);
      });
    }

    function fetchStage(stageId) {
      var group = tasksRepo.getItems(vm.taskId, stageId, { max: 9999 });

      group.$promise.then(function () {
        vm.worklists[stageId] = group.items.length > 0 ? group : null;
      });

      return group.$promise;
    }
  }

})();
