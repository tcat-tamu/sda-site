(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .component('workTitle', {
      templateUrl: 'app/components/work-title/work-title.html',
      bindings: {
        title: '<'
      },
      controller: WorkTitleController
    });

  function WorkTitleController($scope, worksRepo) {
    var vm = this;
    $scope.$watch('$ctrl.title', function (newTitle) {
      if (angular.isArray(newTitle)) {
        vm.title = worksRepo.getTitle(newTitle);
      }
    });
  }

})();
