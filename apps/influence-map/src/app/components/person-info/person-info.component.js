(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .component('personInfo', {
      templateUrl: 'app/components/person-info/person-info.html',
      bindings: {
        person: '<',
        related: '<',
        activate: '&'
      },
      controller: PersonInfoController
    });

  /** @ngInject */
  function PersonInfoController($scope, worksRepo) {
    var vm = this;

    $scope.$watch('$ctrl.person', function (newPerson) {
      if (!newPerson) {
        return;
      }

      var results = worksRepo.searchByAuthor(newPerson.id);
      results.$promise.then(function () {
        vm.works = results.items;
      });
    });

  }

})();
