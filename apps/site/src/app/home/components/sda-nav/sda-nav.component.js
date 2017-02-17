(function () {
  'use strict';

  angular
    .module('sdaHome')
    .component('sdaNav', {
      templateUrl: 'app/home/components/sda-nav/sda-nav.html',
      bindings: {
        modules: '<'
      },
      controller: SdaNavController
    });

  /** @ngInject */
  function SdaNavController($scope, ytVideoModal) {
    var vm = this;

    vm.activateModule = activateModule;
    vm.activateSection = activateSection;
    vm.playVideo = playVideo;

    activate();

    // PUBLIC METHODS

    function activateModule(module) {
      vm.modules.forEach(function (m) {
        m.active = false;
      });

      module.active = true;
    }

    function activateSection(module, section) {
      module.sections.forEach(function (s) {
        s.active = false;
      });

      section.active = true;
    }

    function playVideo($event, videoId) {
      ytVideoModal.show(videoId, $event);
    }

    // PRIVATE METHODS

    function activate() {
      $scope.$watch('$ctrl.modules', function (modules) {
        if (!modules) {
          return;
        }

        activateModule(modules[0]);
        modules.forEach(function (m) {
          activateSection(m, m.sections[0]);
        });
      });
    }

  }

})();
