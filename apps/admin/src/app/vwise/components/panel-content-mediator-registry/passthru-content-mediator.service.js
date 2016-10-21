(function () {
  'use strict';

  angular
    .module('vwise')
    .factory('passthruContentMediator', passthruContentMediatorFactory);

  /** @ngInject */
  function passthruContentMediatorFactory(vwise) {
    function Mediator() {
      vwise.PanelContentMediator.call(this, 'passthru', 'Pass-Through Debug Mediator');
    }

    Mediator.prototype = Object.create(vwise.PanelContentMediator.prototype);

    Mediator.prototype.matches = function matches() {
      return true;
    };

    return new Mediator();
  }

})();
