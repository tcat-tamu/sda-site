(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('ShowTaskController', ShowTaskController);

  /** @ngInject */
  function ShowTaskController($state, $stateParams, $mdSidenav, tasksRepo, $q, sdaToast) {
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
      var taskPromise = vm.task.$promise;
      taskPromise.catch(makeErrorHandler('Unable to load task data from the server.'));

      vm.workflow = tasksRepo.getWorkflow(vm.taskId);
      var workflowPromise = vm.workflow.$promise;
      workflowPromise.catch(makeErrorHandler('Unable to load workflow data from the server.'));

      var worklistPromise = workflowPromise.then(loadWorklist);
      worklistPromise.catch(makeErrorHandler('Unable to load worklist data from the server.'));

      worklistPromise.then(function () {
        vm.loading = false;
      });
    }

    /**
     * Opens the given item in the work editor
     *
     * @param {WorkItem} item
     * @param {Event} $event
     */
    function focusItem(item, $event) {
      $event.stopImmediatePropagation();

      // TODO resolve handler based on item.type
      $state.go('editor.work', { workId: item.entityId });
    }

    /**
     * Applies the given transition to the given item, moving it from its current stage (presumably transition.sourceStage)
     * to the stage identified by transition.targetStage
     *
     * @param {WorkItem} item
     * @param {WorkflowStageTransition} transition
     * @param {Event} $event
     */
    function transitionItem(item, transition, $event) {
      $event.stopImmediatePropagation();

      var updatedItem = tasksRepo.transition(vm.taskId, item, transition);

      updatedItem.$promise.then(function () {
        var refreshPromise = $q.all([
          fetchStage(transition.sourceStage),
          fetchStage(transition.targetStage)
        ]);

        refreshPromise.then(function () {
          sdaToast.success('"' + transition.label + '" applied successfully');
        }, function () {
          sdaToast.error('Unable to refresh worklist after transition');
        });

        return refreshPromise;
      }, function () {
        sdaToast.error('Unable to "' + transition.label + '" item');
      });
    }

    /**
     * Populates all stages of the given workflow
     *
     * @param {Workflow} workflow
     * @return Promise.<Worklist[]>
     */
    function loadWorklist(workflow) {
      var worklistPromises = [];

      angular.forEach(workflow.stages, function (stage) {
        var worklistPromise = fetchStage(stage.id);
        worklistPromises.push(worklistPromise);
      });

      return $q.all(worklistPromises);
    }

    /**
     * Fetches the worklist items for the workflow stage with the given id
     *
     * @param {string} id
     * @return {Promise.<Worklist>}
     */
    function fetchStage(stageId) {
      var group = tasksRepo.getItems(vm.taskId, stageId, { max: 9999 });

      group.$promise.then(function () {
        vm.worklists[stageId] = group.items.length > 0 ? group : null;
      });

      return group.$promise;
    }

    /**
     * Makes an error handler to display the given message in an error toast
     *
     * @param {string} message
     * @return {makeErrorHandler~showErrorToast}
     */
    function makeErrorHandler(message) {
      return showErrorToast;

      /**
       * Shows an error toast, returning a promise that resolves when the toast is dismissed
       *
       * @return {Promise}
       */
      function showErrorToast() {
        return sdaToast.error(message);
      }
    }
  }

})();
