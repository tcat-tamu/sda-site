(function () {
  'use strict';

  angular
    .module('vwise')
    .factory('peopleContentMediator', peopleContentMediatorFactory);

  /** @ngInject */
  function peopleContentMediatorFactory(vwise, peopleRepo) {

    function Mediator() {
      vwise.PanelContentMediator.call(this, 'people', 'People Content Mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.type && obj.type === 'person' && obj.id;
    };

    Mediator.prototype.initPanelData = function initPanelData(obj) {
      return loadPerson(obj.id);
    };

    Mediator.prototype.unmarshall = function unmarshall(dto) {
      return loadPerson(dto.id);
    };

    Mediator.prototype.marshall = function marshall(panelData) {
      var dto = {
        type: 'person',
        id: panelData.id
      };

      return dto;
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<person-panel person="content" vprops="vprops" flex layout="column"></person-panel>'
    };

    return new Mediator();


    function loadPerson(id) {
      var person = peopleRepo.get(id);
      return person.$promise;
    }
  }

})();
