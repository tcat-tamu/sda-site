(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('BookController', BookController);

  /** @ngInject */
  function BookController(work, refs, worksRepo) {
    var vm = this;

    vm.work = work;
    vm.refs = refs;

    vm.title = worksRepo.getTitle(work.titles);
  }

})();
