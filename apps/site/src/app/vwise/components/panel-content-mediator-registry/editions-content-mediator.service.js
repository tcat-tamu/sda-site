(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .factory('editionsContentMediator', editionsContentMediatorFactory);

  /** @ngInject */
  function editionsContentMediatorFactory(vwise, worksRepo) {

    function Mediator() {
      vwise.PanelContentMediator.call(this, 'editions', 'Editions Content Mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.type && obj.type === 'edition' && obj.id && obj.workId;
    };

    Mediator.prototype.initPanelData = function initPanelData(obj) {
      return loadEdition(obj.workId, obj.id);
    };

    Mediator.prototype.unmarshall = function unmarshall(dto) {
      return loadEdition(dto.workId, dto.id);
    };

    Mediator.prototype.marshall = function marshall(panelData) {
      var dto = {
        type: 'edition',
        id: panelData.id,
        workId: panelData.workId
      };

      return dto;
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<edition-panel edition="content" work-id="{{content.workId}}" flex layout="column"></edition-panel>'
    };

    return new Mediator();


    function loadEdition(workId, editionId) {
      var edition = worksRepo.getEdition(workId, editionId);
      return edition.$promise.then(function () {
        edition.workId = workId;
        return edition;
      });
    }
  }

})();
