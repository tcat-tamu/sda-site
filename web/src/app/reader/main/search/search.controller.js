(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('SearchController', SearchController);

   /** @ngInject */
   function SearchController($stateParams, $scope, articleRepository) {
      var vm = this;

      vm.queryResult = {};

      activate();

      function activate() {
         vm.query = $stateParams.query;

         if (vm.query) {
            $scope.$emit('set:query', vm.query);
            vm.queryResult = articleRepository.search({ q: vm.query });
         }
      }
   }

})();
