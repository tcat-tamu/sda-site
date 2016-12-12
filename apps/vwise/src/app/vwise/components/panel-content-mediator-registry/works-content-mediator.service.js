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
      var workP = loadWork(obj.id);
      return $q.all({
        id: obj.id,
        work: workP,
        relationships: workP.then(function (work) {
          return loadRelationships(work.ref.token);
        })
      });
    };

    Mediator.prototype.unmarshall = function unmarshall(dto) {
      var workP = loadWork(dto.id);
      return $q.all({
        id: dto.id,
        work: workP,
        relationships: workP.then(function (work) {
          return loadRelationships(work.ref.token);
        })
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
      var work = worksRepo.getWork(id);
      return work.$promise;
    }

    function loadRelationships(token) {
      var results = relnRepo.search(token);
      return results.$promise.then(function () {
        var relationships = relnRepo.normalizeRelationships(results, token);
        return relationships.$promise.then(function () {

          relationships.forEach(function (group) {
            group.relationships.forEach(function (reln) {
              reln.anchors.forEach(function (anchor) {
                if (anchor.properties.hasOwnProperty('editionId') && anchor.properties.hasOwnProperty('volumeId')) {
                  anchor.type = 'volume';
                  anchor.workId = anchor.ref.id;
                  anchor.editionId = anchor.properties.editionId;
                  anchor.id = anchor.properties.volumeId;
                } else if (anchor.properties.hasOwnProperty('editionId')) {
                  anchor.type = 'edition';
                  anchor.workId = anchor.ref.id;
                  anchor.id = anchor.properties.editionId;
                } else {
                  anchor.type = 'work';
                  anchor.id = anchor.ref.id;
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
