(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .factory('internetArchiveContentMediator', internetArchiveContentMediatorFactory);

  /** @ngInject */
  function internetArchiveContentMediatorFactory(vwise) {
    function Mediator() {
      vwise.PanelContentMediator.call(this, 'ia-reader', 'Internet Archive Digital Copy mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.type && obj.type === 'internetarchive';
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<ia-reader book-id="content.properties.id" page="content.properties.seq" flex></ia-reader>'
    };

    return new Mediator();
  }

})();
