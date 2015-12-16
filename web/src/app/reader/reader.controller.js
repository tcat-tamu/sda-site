(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderController', ReaderController);

   /** @ngInject */
   function ReaderController($state, $scope, articleCollectionRepository) {
      var vm = this;

      vm.showBanner = true;

      vm.search = search;
      vm.query = '';
      vm.rootCollection = [];

      activate();

      function activate() {
         $scope.$on('set:query', function (e, query) {
            vm.query = query;
         });

         vm.rootCollection = articleCollectionRepository.get();
      }

      function search() {
         $state.go('sda.reader.search', { query: vm.query });
      }
   }

})();
