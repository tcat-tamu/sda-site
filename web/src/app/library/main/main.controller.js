(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('MainController', MainController);

   /** @ngInject */
   function MainController($state, $scope) {
      var vm = this;

      vm.search = search;
      vm.query = '';
      vm.activeTab = 'people';
      vm.keyPeople = [];
      vm.keyBooks = [];

      activate();

      function activate() {
         $scope.$on('set:query', function (e, query) {
            vm.query = query;
         });

         vm.keyPeople = [
            { name: 'Andrew Pinsent' },
            { name: 'Neal Audenaert' },
            { name: 'Jesse Mitchell' },
            { name: 'Matthew Barry' }
         ];

         vm.keyBooks = [
            { author: 'David Hume', title: 'Philosophical Essays' },
            { author: 'Thomas Stackhouse', title: 'A Defence of the Christian Religion' },
            { author: 'William Paley', title: 'Horae Paulinae' },
            { author: 'Thomas Woolston', title: 'Six Discourses' },
            { author: 'Nathaniel Lardner', title: 'A Vindication of Three of our Blessed Saviour\'s Miracles' }
         ]
      }

      function search() {
         $state.go('home.search', { query: vm.query });
      }
   }

})();
