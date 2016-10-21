(function () {
  'use strict';

  angular
    .module('vwise')
    .factory('volumesContentMediator', volumesContentMediatorFactory);

  /** @ngInject */
  function volumesContentMediatorFactory(vwise, worksRepo) {

    function Mediator() {
      vwise.PanelContentMediator.call(this, 'volumes', 'Volumes Content Mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.type && obj.type === 'volume' && obj.id && obj.workId && obj.editionId;
    };

    Mediator.prototype.initPanelData = function initPanelData(obj) {
      return loadVolume(obj.workId, obj.editionId, obj.id);
    };

    Mediator.prototype.unmarshall = function unmarshall(dto) {
      return loadVolume(dto.workId, dto.editionId, dto.id);
    };

    Mediator.prototype.marshall = function marshall(panelData) {
      var dto = {
        type: 'volume',
        id: panelData.id,
        workId: panelData.workId,
        editionId: panelData.editionId
      };

      return dto;
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<volume-panel volume="content" edition-id="{{content.editionId}}" work-id="{{content.workId}}" flex layout="column"></volume-panel>'
    };

    return new Mediator();


    function loadVolume(workId, editionId, volumeId) {
      var volume = worksRepo.getVolume(workId, editionId, volumeId);
      return volume.$promise.then(function () {
        volume.workId = workId;
        volume.editionId = editionId;
        return volume;
      });
    }
  }

})();
