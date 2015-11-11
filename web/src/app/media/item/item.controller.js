(function () {
   'use strict';

   angular
      .module('sda.media')
      .controller('ItemController', ItemController);

   /** @ngInject */
   function ItemController($stateParams, $sce, VideoRepository, $log) {
      var vm = this;

      vm.item = {};
      vm.speaker = {};
      vm.getYoutubeVideoUrl = getVideoUrl;

      activate();

      function activate() {
         var videoP = VideoRepository.getVideo($stateParams.id);
         var speakerP = videoP.then(function (video) {
            return VideoRepository.getSpeaker(video.speaker.id);
         });

         videoP.then(function (video) {
            vm.item = video;
         }, function (err) {
            $log.debug('unable to load video', err);
         });

         speakerP.then(function (speaker) {
            vm.speaker = speaker;
         }, function (err) {
            $log.debug('unable to load speaker', err);
         });
      }

      function getVideoUrl(id) {
         return $sce.trustAsResourceUrl('https://youtube.com/embed/' + id);
      }
   }

})();
