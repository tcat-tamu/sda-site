(function () {
  'use strict';

  angular
    .module('sdaHome')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController(content, $state, $stateParams, $scope) {
    var vm = this;
    vm.content = content;
    vm.startSection = $stateParams.section;
    vm.startSlide = $stateParams.slide;
    vm.startNavBucket = $stateParams.bucket;
    vm.startNavTab = $stateParams.tab;

    activate();

    function activate() {
      if (vm.startNavBucket && vm.startNavBucket <= vm.content.modules.length) {
        var activeBucket = vm.content.modules[vm.startNavBucket - 1];
        activeBucket.active = true;

        if (vm.startNavTab && vm.startNavTab <= activeBucket.sections.length) {
          activeBucket.sections[vm.startNavTab - 1].active = true;
        }
      }

      $scope.$on('fullpageScrollChange', function (evt, data) {
        vm.startSection = data.section;
        vm.startSlide = data.slide;
        updateUrl();
      });

      $scope.$on('sdaNavChange', function (evt, data) {
        vm.startNavBucket = data.module;
        vm.startNavTab = data.section;
        updateUrl();
      });

      function updateUrl() {
        $state.go('home', {
          section: vm.startSection,
          slide: vm.startSlide,
          bucket: vm.startNavBucket,
          tab: vm.startNavTab
        }, { notify: false });
      }
    }
  }

})();
