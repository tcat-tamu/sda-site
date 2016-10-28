(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,
      panelContentMediatorRegistry,
      peopleContentMediator,
      worksContentMediator,
      editionsContentMediator,
      volumesContentMediator,
      googleBooksContentMediator,
      hathitrustContentMediator,
      internetArchiveContentMediator,
      noteContentMediator,
      passthruContentMediator) {
    $log.debug('runBlock end');

    panelContentMediatorRegistry.register(peopleContentMediator);
    panelContentMediatorRegistry.register(worksContentMediator);
    panelContentMediatorRegistry.register(editionsContentMediator);
    panelContentMediatorRegistry.register(volumesContentMediator);
    panelContentMediatorRegistry.register(googleBooksContentMediator);
    panelContentMediatorRegistry.register(hathitrustContentMediator);
    panelContentMediatorRegistry.register(internetArchiveContentMediator);
    panelContentMediatorRegistry.register(noteContentMediator);
    panelContentMediatorRegistry.register(passthruContentMediator);
  }

})();
