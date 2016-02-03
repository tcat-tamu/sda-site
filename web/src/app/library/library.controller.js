(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryController', LibraryController);

   /** @ngInject */
   function LibraryController($state, $scope) {
      var vm = this;

      vm.defaultTab = null;
      vm.showBanner = true;

      vm.keyBooks = [];

      activate();

      function activate() {
         if ($state.is('sda.library.search-books')) {
            vm.defaultTab = 'books';
         } else if ($state.is('sda.library.search-people')) {
            vm.defaultTab = 'people';
         }

         $scope.$on('sda-tabbed-sidebar:change:tab', function (e, newTab) {
            vm.defaultTab = newTab.id;
         });

         vm.keyBooks = [
            { author: 'David Hume', title: 'Philosophical Essays' },
            { author: 'Thomas Stackhouse', title: 'A Defence of the Christian Religion' },
            { author: 'William Paley', title: 'Horae Paulinae' },
            { author: 'Thomas Woolston', title: 'Six Discourses' },
            { author: 'Nathaniel Lardner', title: 'A Vindication of Three of our Blessed Saviour\'s Miracles' }
         ]
      }
   }

})();
