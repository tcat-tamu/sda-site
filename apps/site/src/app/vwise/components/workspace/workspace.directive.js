(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .directive('vwiseWorkspace', vwiseWorkspace);

  /** @ngInject */
  function vwiseWorkspace() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/vwise/components/workspace/workspace.html',
      scope: {
        workspace: '='
      },
      controller: WorkspaceController,
      controllerAs: 'vm'
    };

    return directive;
  }

  /** @ngInject */
  function WorkspaceController($scope, panelContentMediatorRegistry) {
    var vm = this;

    vm.thingDropped = thingDropped;
    vm.workspaceClicked = workspaceClicked;

    /**
     * Drop callback for when something is droppen on the workspace content ariea
     * @param  {Event}  evt DOM Event
     * @param  {Object} ui  jQuery UI draggable callback data
     */
    function thingDropped(evt, ui) {
      // get scope of object that was dropped
      var itemScope = ui.draggable.scope();

      // here's the data object of the panel we want to create
      // HACK: need a better way to pass a vwise droppable item in...
      var item = itemScope.item;

      // if no item is available (e.g. if a panel was dropped)
      if (!item) {
        return;
      }

      var offset = angular.element(evt.target).offset();

      // set initial panel attributes
      var context = {
        xPosition: ui.position.left - offset.left,
        yPosition: ui.position.top - offset.top,
        width: 600,
        height: 400,
        background: '#ffffff'
      };

      // who is capable of handling the dropped item
      var contentMediators = panelContentMediatorRegistry.findContentMediators(item, context);
      // $log.debug('found ' + contentMediators.length + ' matching content mediator(s).');
      var mediator = contentMediators.length > 0 ? contentMediators[0] : null;

      if (!mediator) {
        return;
      }

      var contentP = mediator.initPanelData(item, context);
      contentP.then(function (content) {
        return $scope.workspace.createPanel(mediator, content, context);
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
      $scope.workspace.createPanel(mediator, note, context);
    }

    function workspaceClicked(evt) {
      if (evt.ctrlKey) {
        var offset = angular.element(evt.target).offset();
        createNotePanel(evt.clientX - offset.left, evt.clientY - offset.top);
      }
    }
  }

})();
