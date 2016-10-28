(function () {
  'use strict';

  angular
    .module('zotero')
    .controller('ZoteroTestController', ZoteroTestController);

  /** @ngInject */
  function ZoteroTestController() {
    var vm = this;

    vm.item = {};

    vm.types = [];
  }

})();
