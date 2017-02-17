(function () {
  'use strict';

  angular
    .module('sdaHome')
    .component('sdaBillboard', {
      templateUrl: 'app/home/components/sda-billboard/sda-billboard.html',
      bindings: {
        slides: '<'
      },
      controller: SdaBillboardController
    });

  /** @ngInject */
  function SdaBillboardController($scope, ytVideoModal) {
    var vm = this;

    vm.activateSlide = activateSlide;
    vm.activateNext = activateNext;
    vm.activatePrevious = activatePrevious;
    vm.playVideo = playVideo;

    activate();

    // PUBLIC METHODS

    function activateSlide(slide) {
      vm.slides.forEach(function (s) {
        s.active = false;
      });
      slide.active = true;
    }

    function activateNext() {
      var ix = getActiveSlideIndex()
      var nextIndex = (ix + 1) % vm.slides.length;
      activateSlide(vm.slides[nextIndex]);
    }

    function activatePrevious() {
      var ix = getActiveSlideIndex()
      var numSlides = vm.slides.length;
      var nextIndex = (ix + numSlides - 1) % numSlides;
      activateSlide(vm.slides[nextIndex]);
    }

    function playVideo($event, videoId) {
      ytVideoModal.show(videoId, $event);
    }

    // PRIVATE METHODS

    function activate() {
      // show first slide by default
      $scope.$watch('$ctrl.slides', function (slides) {
        if (!slides) {
          return;
        }

        activateSlide(slides[0]);
      });
    }

    function getActiveSlideIndex() {
      var i = vm.slides.length;
      while (i--) {
        if (vm.slides[i].active) {
          return i;
        }
      }

      return -1;
    }
  }
})();
