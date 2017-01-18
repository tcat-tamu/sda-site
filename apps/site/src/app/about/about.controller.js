(function () {
  'use strict';

  angular
    .module('sdaAbout')
    .controller('AboutController', AboutController);

  /** @ngInject */
  function AboutController($state) {
    var vm = this;

    vm.openAboutPage = openAboutPage;

    // PUBLIC METHODS

    function openAboutPage(id) {
      $state.go('about.page', { id: id });
    }
  }

})();
