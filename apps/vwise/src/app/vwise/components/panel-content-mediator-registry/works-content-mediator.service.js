(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .factory('worksContentMediator', worksContentMediatorFactory);

  /** @ngInject */
  function worksContentMediatorFactory($q, vwise, worksRepo, relnRepo) {

    function Mediator() {
      vwise.PanelContentMediator.call(this, 'works', 'Works Content Mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.type && obj.type === 'work' && obj.id;
    };

    Mediator.prototype.initPanelData = function initPanelData(obj) {
      return $q.all({
        id: obj.id,
        work: loadWork(obj.id),
        relationships: loadRelationships(obj.id)
      });
    };

    Mediator.prototype.unmarshall = function unmarshall(dto) {
      return $q.all({
        id: dto.id,
        work: loadWork(dto.id),
        relationships: loadRelationships(dto.id)
      });
    };

    Mediator.prototype.marshall = function marshall(panelData) {
      var dto = {
        type: 'work',
        id: panelData.id
      };

      return dto;
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<work-panel work="content.work" relationships="content.relationships" vprops="vprops" flex layout="column"></work-panel>'
    };

    return new Mediator();


    function loadWork(id) {
      var work = worksRepo.get(id);
      return work.$promise;
    }

    function loadRelationships(workId) {
      var currentUri = 'works/' + workId;
      var results = relnRepo.search(currentUri);
      return results.$promise.then(function () {
        var relationships = relnRepo.normalizeRelationships(results, currentUri, worksRepo);
        return relationships.$promise.then(function () {

          relationships.forEach(function (group) {
            group.relationships.forEach(function (reln) {
              reln.entities.forEach(function (entity) {

                entity.entity.$promise.then(function () {
                  entity.title = worksRepo.getTitle(entity.entity.titles);
                });

                switch(entity.type) {
                  case 'work':
                    entity.id = entity.refParams.workId;
                    break;
                  case 'edition':
                    entity.workId = entity.refParams.workId;
                    entity.id = entity.refParams.editionId;
                    break;
                  case 'volume':
                    entity.workId = entity.refParams.workId;
                    entity.editionId = entity.refParams.editionId;
                    entity.id = entity.refParams.volumeId;
                    break;
                }
              });
            });
          });

          return relationships;
        });
      });
    }
  }

})();
