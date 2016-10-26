(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('PersonController', PersonController);

  /** @ngInject */
  function PersonController(person, relatedWorks) {
    var vm = this;

    vm.person = person;
    vm.relatedWorks = relatedWorks;
  }

})();
