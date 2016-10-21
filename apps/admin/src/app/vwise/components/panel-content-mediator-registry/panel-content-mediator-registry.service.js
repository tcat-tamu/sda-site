(function () {
  'use strict';

  angular
    .module('vwise')
    .factory('panelContentMediatorRegistry', panelContentMediatorRegistryFactory);

  /** @ngInject */
  function panelContentMediatorRegistryFactory(vwise) {
    return new vwise.PanelContentMediatorRegistry();
  }

})();
