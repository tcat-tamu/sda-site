(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .directive('dateEditor', dateEditorDirective);

  /** @ngInject */
  function dateEditorDirective(guessDate) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/date-editor/date-editor.html',
      scope: {
        date: '=ngModel'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope) {
      // indicates whether the current value in the date.calendar field was automatically set
      scope.calendarAutoSet = false;

      scope.$watch('date.description', function (dateDescription) {
        if (dateDescription && (!scope.date.calendar || scope.calendarAutoSet)) {
          scope.date.calendar = guessDate(dateDescription).format('YYYY-MM-DD');
          scope.calendarAutoSet = true;
        }
      });
    }
  }

})();
