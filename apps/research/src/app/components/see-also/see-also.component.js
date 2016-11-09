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

  // emulation of an enum
  var TypeId = {
    WORK: 'trc.entries.bibliographic',
    PERSON: 'trc.entries.biographical',
    ARTICLE: 'trc.entries.article'
  };

  /** @ngInject */
  function RelationshipsController($scope, $state, $window, seeAlsoRepo) {
    var vm = this;

    vm.loading = false;
    vm.relns = null;

    vm.openLink = openLink;

    activate();

    // PUBLIC METHODS

    function openLink($event, anchor) {
      switch(anchor.type) {
        case TypeId.WORK:
          $state.go('library.book', { id: anchor.id });
          break;
        case TypeId.PERSON:
          $state.go('library.person', { id: anchor.id });
          break;
        case TypeId.ARTICLE:
          $window.location.href = '/themes/#/article/' + anchor.id;
          break;
        default:
          $mdToast.showSimple('I don\'t know how to follow that link.');
          break;
      }
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
