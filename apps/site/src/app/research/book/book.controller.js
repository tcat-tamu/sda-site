(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('BookController', BookController);

  /** @ngInject */
  function BookController(work, refs, worksRepo, seeAlsoLinkHandler) {
    var vm = this;

    vm.work = work;
    vm.refs = refs;

    vm.title = worksRepo.getTitle(work.titles);

    vm.openSeeAlso = seeAlsoLinkHandler
  }

})();
