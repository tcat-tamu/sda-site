(function () {
   'use strict';

   angular
      .module('sda.media')
      .controller('MainController', MainController);

   /** @ngInject */
   function MainController(VideoRepository) {
      var vm = this;

      vm.playlists = [];

      activate();

      function activate() {
         VideoRepository.getPlaylists().then(function (playlists) {
            vm.playlists = playlists;
         });
      }
   }

})();
