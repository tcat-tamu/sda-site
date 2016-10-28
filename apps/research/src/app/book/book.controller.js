(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('BookController', BookController);

  /** @ngInject */
  function BookController(work, refs, relns, worksRepo) {
    var vm = this;

    vm.work = work;
    vm.refs = refs;
    vm.relns = relns;

    vm.title = worksRepo.getTitle(work.titles);
  }

})();
