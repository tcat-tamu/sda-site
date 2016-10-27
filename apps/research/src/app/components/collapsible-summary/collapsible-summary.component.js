(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('collapsibleSummary', {
      templateUrl: 'app/components/collapsible-summary/collapsible-summary.html',
      bindings: {
        content: '<'
      },
      controller: CollapsibleSummaryController
    });

  var CHAR_THRESHOLD = 500;

  /** @ngInject */
  function CollapsibleSummaryController($scope) {
    var vm = this;

    $scope.$watch('$ctrl.content', function (newContent) {
      vm.longEnough = (!newContent || newContent.length > CHAR_THRESHOLD);
    });
  }

})();
