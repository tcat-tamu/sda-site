(function () {
  'use strict';

  angular
    .module('trcBio')
    .directive('trcPersonEditor', trcPersonEditorDirective);

  /** @ngInject */
  function trcPersonEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/trc-bio/person-editor.html',
      scope: {
        person: '=ngModel'
      },
      controller: PersonEditorController,
      controllerAs: 'personEditor'
    };

    return directive;

    /** @ngInject */
    function PersonEditorController($scope, peopleRepo) {
      var vm = this;

      vm.addName = addName;
      vm.removeName = removeName;
      vm.addEvent = addEvent;
      vm.removeEvent = removeEvent;

      /**
       * Adds a name to the current person model.
       */
      function addName() {
        var newName = peopleRepo.createName();
        $scope.person.altNames.push(newName);
      }

      /**
       * Removes the name at the specified index from the current person model.
       *
       * @param {integer} ix
       */
      function removeName(ix) {
        $scope.person.altNames.splice(ix, 1);
      }

      /**
       * Adds an event to the current person model.
       *
       * @param {string} key - 'birth' or 'death'
       */
      function addEvent(key) {
        var newEvent = peopleRepo.createEvent();
        $scope.person[key] = newEvent;
      }

      /**
       * Removes the event from the current person model.
       *
       * @param {string} key - 'birth' or 'death'
       */
      function removeEvent(key) {
        $scope.person[key] = null;
      }
    }
  }

})();
