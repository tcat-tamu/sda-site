(function () {
  'use strict';

  angular
    .module('sdaAdminWeb')
    .controller('RelationshipEditDialogController', RelationshipEditDialogController);

  /** @ngInject */
  function RelationshipEditDialogController($mdDialog, worksRepo, relationshipsRepo, currentUri, relationship) {
    var vm = this;

    vm.relationship = relationship;
    vm.types = [];
    vm.selectedType = null;
    vm.targets = [];
    vm.selectedTarget = null;
    vm.searchText = '';
    vm.isReverse = false;

    vm.getResults = getResults;
    vm.selectWork = selectWork;
    vm.setType = setType;
    vm.setTarget = setTarget;
    vm.close = close;
    vm.cancel = cancel;

    activate();

    function activate() {
      vm.types = getTypes();

      vm.target = relationshipsRepo.createAnchor();
      vm.relationship.targetEntities = [vm.target];

      var self = relationshipsRepo.createAnchor();
      self.entryUris = [currentUri];
      vm.relationship.relatedEntities = [self];

      vm.relationship.descriptionMimeType = 'text/html';
    }

    function getTypes() {
      var rawTypes = relationshipsRepo.getTypes();
      var types = [];

      Object.defineProperty(types, '$promise', {
        value: rawTypes.$promise
      });

      rawTypes.$promise.then(function () {
        angular.forEach(rawTypes, function (type) {
          types.push({
            id: type.identifier,
            label: type.title,
            reverse: false
          });

          if (type.isDirected) {
            types.push({
              id: type.identifier,
              label: type.reverseTitle,
              reverse: true
            });
          }
        });
      });

      return types;
    }

    function getResults(query) {
      var results = worksRepo.search(query);
      return results.$promise.then(function () {
        return results.items;
      });
    }

    function setType(type) {
      vm.relationship.typeId = type.id;
      if (vm.isReverse && !type.reverse || !vm.isReverse && type.reverse) {
        var swap = vm.relationship.relatedEntities;
        vm.relationship.relatedEntities = vm.relationship.targetEntities;
        vm.relationship.targetEntities = swap;
      }
      vm.isReverse = type.reverse;
    }

    function selectWork(workProxy) {
      vm.targets = [];

      if (!workProxy) {
        return;
      }

      var work = worksRepo.getWork(workProxy.id);

      work.$promise.then(function () {
        var workUri = 'works/' + work.id;
        var workTitle = worksRepo.getTitle(work.titles, ['short', 'canonical', 'bibliographic']);

        vm.targets.push({
          uri: workUri,
          label: workTitle.title + (workTitle.subtitle ? ': ' + workTitle.subtitle : '')
        });

        work.editions.forEach(function (edition) {
          var editionUri = workUri + '/editions/' + edition.id;
          var editionTitle = worksRepo.getTitle(edition.titles, ['short', 'canonical', 'bibliographic']);

          vm.targets.push({
            uri: editionUri,
            label: editionTitle.title + (editionTitle.subtitle ? ': ' + editionTitle.subtitle : '') + '. ' + edition.editionName
          });

          edition.volumes.forEach(function (volume) {
            var volumeUri = editionUri + '/volumes/' + volume.id;
            var volumeTitle = worksRepo.getTitle(volume.titles, ['short', 'canonical', 'bibliographic']);

            vm.targets.push({
              uri: volumeUri,
              label: volumeTitle.title + (volumeTitle.subtitle ? ': ' + volumeTitle.subtitle : '') + '. ' + edition.editionName + '. Volume ' + volume.volumeNumber
            });
          });
        });

        vm.selectedTarget = vm.targets[0];
        setTarget(vm.selectedTarget);
      });
    }

    function setTarget(target) {
      vm.target.entryUris = target && target.uri ? [target.uri] : [];
    }

    function close() {
      $mdDialog.hide(vm.relationship);
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }

})();
