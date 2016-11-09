(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .factory('relnEditDialog', relnEditDialogFactory);

  /** @ngInject */
  function relnEditDialogFactory($mdDialog) {
    return {
      show: showDialog
    };

    function showDialog($event) {

      var dialog = {
        targetEvent: $event,
        templateUrl: 'app/work/components/reln-edit-dialog/reln-edit-dialog.html',
        controller: RelationshipEditDialogController,
        controllerAs: 'vm'
      };

      return $mdDialog.show(dialog);

    }
  }

  /** @ngInject */
  function RelationshipEditDialogController($filter, $mdDialog, worksRepo, relnRepo) {
    var stripTags = $filter('stripTags');
    var vm = this;

    vm.description = null;

    vm.types = null;
    vm.selectedType = null;

    vm.searchText = null;
    vm.selectedWork = null;

    vm.anchors = null;
    vm.selectedAnchor = null;

    vm.search = search;
    vm.selectWork = selectWork;
    vm.close = close;
    vm.cancel = cancel;

    activate();

    function activate() {
      vm.types = getTypes();
    }

    function getTypes() {
      var rawTypes = relnRepo.getTypes();
      var types = [];

      var typesP = rawTypes.$promise.then(function () {
        angular.forEach(rawTypes, function (type) {
          types.push({
            id: type.identifier,
            label: type.title,
            directed: type.isDirected,
            reverse: false
          });

          if (type.isDirected) {
            types.push({
              id: type.identifier,
              label: type.reverseTitle,
              directed: type.isDirected,
              reverse: true
            });
          }
        });

        return types;
      });


      Object.defineProperty(types, '$promise', {
        value: typesP
      });

      return types;
    }

    function search(query) {
      var results = worksRepo.search(query);
      return results.$promise.then(function () {
        return results.items;
      });
    }

    function selectWork(proxy) {
      vm.anchors = [];

      if (!proxy) {
        return;
      }

      var baseLabel = stripTags(proxy.label);
      var baseToken = proxy.ref.token;

      // create default anchor for top-level work
      vm.selectedAnchor = relnRepo.createAnchor(baseLabel, baseToken);
      vm.anchors.push(vm.selectedAnchor);

      var work = worksRepo.getWork(proxy.id);
      work.$promise.then(function () {
        work.editions.forEach(function (edition) {
          // create anchor for each edition
          var editionLabel = baseLabel + '. ' + edition.editionName;
          vm.anchors.push(relnRepo.createAnchor(editionLabel, baseToken, {
            editionId: [edition.id]
          }));

          edition.volumes.forEach(function (volume) {
            // create anchor for each volume
            var volumeLabel = editionLabel + '. Volume ' + volume.volumeNumber;
            vm.anchors.push(relnRepo.createAnchor(volumeLabel, baseToken, {
              editionId: [edition.id],
              volumeId: [volume.id]
            }));
          });
        });
      });
    }

    function close() {
      $mdDialog.hide({
        typeId: vm.selectedType.id,
        directed: vm.selectedType.directed,
        reverse: vm.selectedType.reverse,
        target: vm.selectedAnchor,
        description: vm.description
      });
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }

})();
