(function () {
  'use strict';

  angular
    .module('trcBio')
    .directive('trcNameEditor', trcNameEditorDirective);

  /** @ngInject */
  function trcNameEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/trc-bio/name-editor.html',
      scope: {
        name: '=ngModel'
      },
      controller: NameEditorController,
      controllerAs: 'nameEditor'
    };

    return directive;

    function NameEditorController() {
      var vm = this;

      vm.roles = [
        { value: 'canonical', label: 'Canonical Name' },
        { value: 'pseudonym', label: 'Pseudonym' },
        { value: 'maiden', label: 'Maiden Name' },
        { value: 'designation', label: 'Honorary Designation' },
        { value: 'nickname', label: 'Nickname' },
        { value: 'phonetic', label: 'Phonetic Name' }
      ];
    }
  }

})();
