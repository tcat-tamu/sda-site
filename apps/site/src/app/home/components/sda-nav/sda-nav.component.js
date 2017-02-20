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
  function SdaNavController($scope, ytVideoModal, _) {
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

      if (!module.sections.some(function (s) { return s.active; })) {
        activateSection(module, module.sections[0]);
      } else {
        $scope.$emit('sdaNavChange', {
          module: vm.modules.indexOf(module) + 1,
          section: _.findIndex(module.sections, function (s) { return s.active; }) + 1
        });
      }
    }

    function activateSection(module, section) {
      module.sections.forEach(function (s) {
        s.active = false;
      });

      section.active = true;

      $scope.$emit('sdaNavChange', {
        module: vm.modules.indexOf(module) + 1,
        section: module.sections.indexOf(section) + 1
      });
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

        // activate first module if one is not already active;
        if (!modules.some(function (m) { return m.active; })) {
          activateModule(modules[0]);
        }
      });
    }

  }

})();
