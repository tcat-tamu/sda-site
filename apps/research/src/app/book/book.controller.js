(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('BookController', BookController);

  /** @ngInject */
  function BookController(work, worksRepo) {
    var vm = this;

    vm.work = work;

    vm.title = worksRepo.getTitle(work.titles);
  }

})();
