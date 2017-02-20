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

    activate();

    function activate() {
      $scope.$on('fullpageScrollChange', function (evt, data) {
        vm.startSection = data.section;
        vm.startSlide = data.slide;
        updateUrl();
      });

      function updateUrl() {
        $state.go('home', {
          section: vm.startSection,
          slide: vm.startSlide,
        }, { notify: false });
      }
    }
  }

})();
