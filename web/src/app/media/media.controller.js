(function () {
   'use strict';

   angular
      .module('sda.media')
      .controller('MediaController', MediaController);

   /** @ngInject */
   function MediaController(videoRepository) {
      var vm = this;

      vm.showBanner = true;

      vm.playlists = [];

      activate();

      function activate() {
         videoRepository.getPlaylists().then(function (playlists) {
            vm.playlists = playlists;
         });
      }
   }

})();
