/**
 * @typedef {object} Workflow
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {object.<string, WorkflowStage>} stages
 * @property {string} status
 */

/**
 * @typedef {object} WorkflowStage
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {boolean} isFinal
 * @property {WorkflowStageTransition[]} transitions
 */

/**
 * @typedef {object} WorkflowStageTransition
 * @property {string} sourceStage
 * @property {string} targetStage
 * @property {string} label
 */

/**
 * @typedef {object} Worklist
 * @property {string} groupId
 * @property {string} label
 * @property {integer} itemCount
 * @property {integer} start
 * @property {integer} max
 * @property {WorkItem[]} items
 */

/**
 * @typedef {object} WorkItem
 * @property {string} itemId
 * @property {string} type
 * @property {string} entityId
 * @property {string} label
 * @property {object.<string,string>} properties
 * @property {string} stage
 * @property {string} task
 */

(function () {
  'use strict';

  angular
    .module('trcTasks')
    .provider('tasksRepo', tasksRepoProvider);

  /**
   * @return {angular.provider}
   */
  function tasksRepoProvider() {
    var provider = {};
    provider.url = '/api/tasks';
    provider.$get = tasksRepoFactory;
    return provider;

    /** @ngInject */
    function tasksRepoFactory($resource) {
      var taskResource = $resource(provider.url + '/:taskId', { taskId: '@id' });
      var workflowResource = $resource(provider.url + '/:taskId/workflow');
      var itemResource = $resource(provider.url + '/:taskId/items/:itemId', { itemId: '@itemId' });

      var repo = {};
      repo.getTask = getTask;
      repo.getWorkflow = getWorkflow;
      repo.all = getAllTasks;
      repo.getItems = getItems;
      repo.transition = transition;
      return repo;

      /**
       * Retrieves a listing of all tasks
       *
       * @return {Task[]}
       */
      function getAllTasks() {
        return taskResource.query();
      }

      /**
       * Retrieves a task by id
       *
       * @param  {string} taskId
       * @return {GroupedTaskList}
       */
      function getTask(taskId) {
        return taskResource.get({ taskId: taskId });
      }

      /**
       * Retrieves a workflow by task id
       * @param  {string} taskId
       * @return {Workflow}
       */
      function getWorkflow(taskId) {
        return workflowResource.get({ taskId: taskId });
      }

      /**
       * Gets items from the task endpoint for a given stage
       *
       * @param  {string}  [taskId]  Task ID
       * @param  {string}  stageId          Workflow stage for which to get items
       * @param  {object}  options
       * @param  {integer} [options.start]  Starting index
       * @param  {integer} [options.max]    Maximum number of items to fetch per page
       * @return {Worklist}
       */
      function getItems(taskId, stageId, options) {
        options = options || {};
        return itemResource.get({
          taskId: taskId,
          stage: stageId,
          start: options.start,
          max: options.max
        });
      }

      /**
       * Transition an item from its current stage to a target stage
       *
       * @param  {WorkItem}                item   Work item instance
       * @param  {WorkflowStageTransition} transition Target workflow stage
       * @return {WorkItem}                       Updated work item instance
       */
      function transition(taskId, item, transition) {
        if (item.stage !== transition.sourceStage) {
          throw new Error('Transition (' + transition.sourceStage + ' -> ' + transition.targetStage + ') is not valid for item currently in stage ' + item.stage);
        }

        var result = itemResource.save({
          taskId: taskId,
          itemId: item.itemId
        }, {
          stage: transition.targetStage,
          // NOTE comments are not saved yet
          comments: null
        });

        // propagate updates to the original item
        result.$promise.then(function (resp) {
          angular.extend(item, resp);
        });

        return result;
      }
    }
  }

})();
