(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .factory('hathitrustContentMediator', hathitrustContentMediatorFactory);

  /** @ngInject */
  function hathitrustContentMediatorFactory(vwise) {
    function Mediator() {
      vwise.PanelContentMediator.call(this, 'ht-reader', 'HathiTrust Digital Copy mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches(obj) {
      return obj.type && obj.type === 'hathitrust';
    };

    Mediator.prototype.getTemplate = function getTemplate() {
      return '<hathitrust-reader book-id="content.properties.htid" page="content.properties.seq" flex></hathitrust-reader>'
    };

    return new Mediator();
  }

})();
