(function () {
  'use strict';

  angular
    .module('sdaHome')
    .directive('fullpageScrollSlide', fullpageScrollSlide);

  /** @ngInject */
  function fullpageScrollSlide() {
    var directive = {
      restrict: 'E',
      require: '^fullpageScroll',
      link: linkFunc,
      transclude: true,
      replace: true,
      template: '<div class="fullpage-scroll-slide" ng-transclude></div>'
    };

    return directive;

    function linkFunc(scope, el, attr, parent) {
      parent.rebuild();
    }
  }

})();
