(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .directive('contenteditable', contenteditable);

  /** @ngInject */
  function contenteditable($sce) {
    var directive = {
      restrict: 'A',
      require: '?ngModel',
      link: linkFunc
    };

    return directive;

    function linkFunc($scope, $el, attrs, ngModel) {
      if (!ngModel) {
        return;
      }

      ngModel.$render = function () {
        $el.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      $el.on('blur keyup change', function () {
        $scope.$apply(function () {
          ngModel.$setViewValue($el.html());
        });
      });
    }
  }

})();
