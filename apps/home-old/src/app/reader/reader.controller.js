(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderController', ReaderController);

   /** @ngInject */
   function ReaderController($state, $scope, _) {
      var vm = this;

      vm.showBanner = true;

      vm.search = search;
      vm.query = '';

      vm.nodeHasArticles = nodeHasArticles;

      activate();

      function activate() {
         $scope.$on('set:query', function (e, query) {
            vm.query = query;
         });

      }

      function nodeHasArticles(node) {
         return _.size(node.articles) > 0;
      }

      function search() {
         $state.go('sda.reader.search', { query: vm.query });
      }
   }

})();
