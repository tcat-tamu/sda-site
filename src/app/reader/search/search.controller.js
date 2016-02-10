(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderSearchController', ReaderSearchController);

   /** @ngInject */
   function ReaderSearchController($stateParams, $scope, articleRepository, $http) {
      var vm = this;

      vm.queryResult = {};
      vm.displayFirstPage = displayFirstPage;
      vm.displayPrevPage = displayPrevPage;
      vm.displayNextPage = displayNextPage;
      vm.displayLastPage = displayLastPage;

      activate();

      function activate() {
         vm.query = $stateParams.query;

         if (vm.query) {
            $scope.$emit('set:query', vm.query);
            vm.queryResult = articleRepository.search({ q: vm.query });
         }
      }

      function displayLastPage() {
         if (vm.queryResult.last) {
            $http.get(vm.queryResult.query.last.uri)
               .then(function (resp) {
                  vm.queryResult = resp.data;
               });
         }
      }

      function displayNextPage() {
         if (vm.queryResult.next) {
            $http.get(vm.queryResult.query.next.uri)
               .then(function (resp) {
                  vm.queryResult = resp.data;
               });
         }
      }

      function displayPrevPage() {
         if (vm.queryResult.previous) {
            $http.get(vm.queryResult.query.previous.uri)
               .then(function (resp) {
                  vm.queryResult = resp.data;
               });
         }
      }

      function displayFirstPage() {
         if (vm.queryResult.first) {
            $http.get(vm.queryResult.query.first.uri)
               .then(function (resp) {
                  vm.queryResult = resp.data;
               });
         }
      }
   }

})();
