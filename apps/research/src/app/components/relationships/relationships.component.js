(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('relationships', {
      templateUrl: 'app/components/relationships/relationships.html',
      bindings: {
        token: '<'
      },
      controller: RelationshipsController
    });

  /** @ngInject */
  function RelationshipsController($scope, relnRepo) {
    var vm = this;

    vm.loading = false;
    vm.relns = null;

    $scope.$watch('$ctrl.token', function (newToken) {
      if (!newToken) {
        return;
      }

      vm.loading = true;
      var relns = relnRepo.search(newToken);

      var normRelnsP = relns.$promise.then(function () {
        var normRelns = relnRepo.normalizeRelationships(relns, newToken);
        return normRelns.$promise;
      });

      normRelnsP.then(function (normRelns) {
        vm.loading = false;
        vm.relns = normRelns;
      }, function () {
        vm.loading = false;
        vm.relns = null;
      });
    });

  }

})();
