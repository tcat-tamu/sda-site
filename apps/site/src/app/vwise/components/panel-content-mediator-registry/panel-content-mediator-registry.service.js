(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .factory('panelContentMediatorRegistry', panelContentMediatorRegistryFactory);

  /** @ngInject */
  function panelContentMediatorRegistryFactory(vwise) {
    return new vwise.PanelContentMediatorRegistry();
  }

})();
