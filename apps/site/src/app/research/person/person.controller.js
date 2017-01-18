(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('PersonController', PersonController);

  /** @ngInject */
  function PersonController(person, refs, relatedWorks, seeAlsoLinkHandler) {
    var vm = this;

    vm.person = person;
    vm.refs = refs;
    vm.relatedWorks = relatedWorks;

    vm.openSeeAlso = seeAlsoLinkHandler;
  }

})();
