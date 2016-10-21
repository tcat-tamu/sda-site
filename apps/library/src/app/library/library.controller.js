(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .controller('LibraryController', LibraryController);

  /** @ngInject */
  function LibraryController($mdSidenav, $mdToast, worksRepo, peopleRepo) {
    var vm = this;

    vm.toggleSidenav = toggleSidenav;

    vm.searchPeople = searchPeople;
    vm.peopleLoading = false;
    vm.peopleResults = null;

    vm.searchBooks = searchBooks;
    vm.booksLoading = false;
    vm.booksResults = null;

    activate();

    function activate() {
    }

    function searchPeople(query) {
      vm.peopleLoading = true;
      vm.peopleResults = peopleRepo.search(query);
      vm.peopleResults.$promise.then(function () {
        vm.peopleLoading = false;
      }, function () {
        vm.peopleLoading = false;
        vm.peopleResults = null;
        $mdToast.showSimple('Failed to load search results');
      });
    }

    function searchBooks(query) {
      vm.booksLoading = true;
      vm.booksResults = worksRepo.search(query);
      vm.booksResults.$promise.then(function () {
        vm.booksLoading = false;
      }, function () {
        vm.booksLoading = false;
        vm.booksResults = null;
        $mdToast.showSimple('Failed to load search results');
      });
    }

    function toggleSidenav(id) {
      $mdSidenav(id).toggle();
    }

  }
})();
