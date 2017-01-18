(function () {
  'use strict';

  angular
    .module('sdaAbout')
    .controller('AboutController', AboutController);

  /** @ngInject */
  function AboutController($state, page, articlesRepo) {
    var vm = this;

    vm.page = page;
    vm.openAboutPage = openAboutPage;

    // PUBLIC METHODS

    function openAboutPage(id) {
      vm.page = articlesRepo.get(id);
      $state.go('.', { id: id }, { notify: false});
    }
  }

})();
