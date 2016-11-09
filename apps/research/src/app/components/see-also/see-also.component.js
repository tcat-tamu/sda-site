(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('seeAlso', {
      templateUrl: 'app/components/see-also/see-also.html',
      bindings: {
        token: '<'
      },
      controller: RelationshipsController
    });

  /** @ngInject */
  function RelationshipsController($scope, seeAlsoRepo) {
    var vm = this;

    vm.loading = false;
    vm.relns = null;

    vm.openLink = openLink;

    activate();

    // PUBLIC METHODS

    function openLink($event, link) {
      // TODO: see-also links
    }

    // PRIVATE METHODS

    function activate() {
      $scope.$watch('$ctrl.token', function (newToken) {
        if (!newToken) {
          return;
        }

        vm.loading = true;

        vm.seeAlso = seeAlsoRepo.get(newToken);

        vm.seeAlso.$promise.then(function () {
          vm.loading = false;
        }, function () {
          vm.loading = false;
          vm.seeAlso = null;
        })

      });
    }
  }

})();
