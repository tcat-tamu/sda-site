(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('MainController', MainController);

   /** @ngInject */
   function MainController($state, $scope) {
      var vm = this;

      vm.search = search;
      vm.query = '';
      vm.facets = [];

      vm.overviews = [];
      vm.articles = [];
      vm.bookReviews = [];
      vm.biographies = [];

      activate();

      function activate() {
         $scope.$on('set:query', function (e, query) {
            vm.query = query;
         });

         vm.facets = [
            {
               label: 'Thematic Overviews',
               value: 'overview',
               selected: false
            },
            {
               label: 'Articles',
               value: 'article',
               selected: false
            },
            {
               label: 'Book Reviews',
               value: 'review',
               selected: false
            },
            {
               label: 'Biographies',
               value: 'biography',
               selected: false
            }
         ];

         vm.overviews = [
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' }
         ];

         vm.articles = [
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' }
         ];

         vm.bookReviews = [
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' }
         ];

         vm.biographies = [
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' },
            { title: 'Lorem ipsum' }
         ];
      }

      function search() {
         $state.go('articles.search', { query: vm.query });
      }
   }

})();
