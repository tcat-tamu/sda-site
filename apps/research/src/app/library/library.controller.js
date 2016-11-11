(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('LibraryController', LibraryController);

  /** @ngInject */
  function LibraryController($http, $mdSidenav, $mdToast, trcSearch) {
    var vm = this;

    vm.navigation = [];

    vm.search = search;
    vm.loading = false;
    vm.results = null;

    activate();

    function activate() {
      $http.get('/assets/data/navigation.json').then(function (res) {
        vm.navigation = res.data;
      });
    }

    function search(query) {
      vm.loading = true;
      vm.results = trcSearch.search(query);
      vm.results.$promise.then(function () {
        vm.loading = false;
      }, function () {
        vm.loading = false;
        vm.results = null;
        $mdToast.showSimple('Failed to load search results');
      });
    }
  }
})();
