module.exports = {
  template: require('./see-also.html'),
  bindings: {
    showHeading: '<',
    token: '<',
    onClickItem: '&'
  },
  controller: RelationshipsController
};

/** @ngInject */
function RelationshipsController($scope, $state, $window, $mdToast, seeAlsoRepo) {
  var vm = this;

  vm.loading = false;
  vm.relns = null;

  activate();

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
