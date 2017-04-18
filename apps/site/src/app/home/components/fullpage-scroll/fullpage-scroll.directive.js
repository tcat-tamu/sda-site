(function () {
  'use strict';

  angular
    .module('sdaHome')
    .directive('fullpageScroll', fullpageScroll);

  /** @ngInject */
  function fullpageScroll() {
    var directive = {
      restrict: 'AC',
      link: linkFunc,
      controller: FullpageScrollController,
      controllerAs: 'fullpageScroll'
    };

    return directive;

    function linkFunc(scope, el, attr) {
      scope.fullpageScroll.el = el;
      scope.fullpageScroll.options = {
        scrollOverflow: true,
        sectionSelector: '.fullpage-scroll-section',
        slideSelector: '.fullpage-scroll-slide',
        paddingTop: '4rem', // HACK
        afterLoad: function (sectionAnchor, sectionIndex) {
          scope.$emit('fullpageScrollChange', {
            section: sectionIndex
          });
        },
        afterSlideLoad: function (sectionAnchor, sectionIndex, slideAnchor, slideIndex) {
          scope.$emit('fullpageScrollChange', {
            section: sectionIndex,
            slide: slideIndex
          });
        }
      };

      scope.fullpageScroll.init(scope.$eval(attr.startSection), scope.$eval(attr.startSlide));
    }

    /** @ngInject */
    function FullpageScrollController($scope, $window, _) {
      var fullpageScroll = this;

      fullpageScroll.init = init;
      fullpageScroll.rebuild = _.debounce(rebuild, 100);
      fullpageScroll.nextSection = nextSection;
      fullpageScroll.destroy = destroy;

      $scope.$on('$destroy', destroy);

      function init(initialSectionIndex, initialSlideIndex) {
        if (fullpageScroll.initialized) {
          return;
        }

        fullpageScroll.el.fullpage(fullpageScroll.options);

        $window.jQuery.fn.fullpage.silentMoveTo(initialSectionIndex || 1, initialSlideIndex || 1)

        fullpageScroll.initialized = true;
      }

      function rebuild() {
        if (!fullpageScroll.initialized) {
          return;
        }

        fullpageScroll.destroy();
        fullpageScroll.init();
      }

      function nextSection() {
        $window.jQuery.fn.fullpage.moveSectionDown();
      }

      function destroy() {
        if (!fullpageScroll.initialized) {
          return;
        }

        $window.jQuery.fn.fullpage.destroy('all');
        fullpageScroll.initialized = false;
      }
    }
  }

})();
