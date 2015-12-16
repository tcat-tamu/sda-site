(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderController', ReaderController);

   /** @ngInject */
   function ReaderController($state, $scope, $http, _) {
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

         var rootCollectionP = $http.get('app/reader/collections.json').then(_.property('data'));

         rootCollectionP.then(function (root) {
            vm.rootCollection = $adaptCollection(root);

            console.log(vm.rootCollection);
         });
      }

      function $adaptCollection(collection) {
         var adapted = _.pick(collection, ['title']);
         adapted.summary = _.findWhere(collection.articles, {type: 'summary'});
         adapted.children = angular.isArray(collection.children) ? collection.children.map($adaptCollection) : [];
         return adapted;
      }

      function search() {
         $state.go('sda.reader.search', { query: vm.query });
      }
   }

})();
