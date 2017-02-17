(function () {
  'use strict';

  angular
    .module('sdaHome')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController(content) {
    var vm = this;
    vm.content = content;

    activate();

    function activate() {
    }
  }

})();
