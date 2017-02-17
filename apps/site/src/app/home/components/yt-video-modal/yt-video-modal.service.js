(function () {
  'use strict';

  angular
    .module('sdaHome')
    .factory('ytVideoModal', YtVideoModalFactory);

  /** @ngInject */
  function YtVideoModalFactory($mdDialog) {
    return {
      show: show
    };

    /**
     * Displays a modal dialog with an embedded YouTube video player
     * @param  {string} videoId
     * @param  {MouseEvent} [$event]
     * @return {Promise}
     */
    function show(videoId, $event) {
      var config = {
        targetEvent: $event,
        templateUrl: 'app/home/components/yt-video-modal/yt-video-modal.html',
        controller: function YtVideoModalController() {
          this.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
          this.close = $mdDialog.hide;
        },
        controllerAs: 'vm'
      };

      return $mdDialog.show(config);
    }

  }

})();
