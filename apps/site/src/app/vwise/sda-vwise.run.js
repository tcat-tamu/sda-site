(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .run(runBlock);

  /** @ngInject */
  function runBlock(panelContentMediatorRegistry,
      peopleContentMediator,
      worksContentMediator,
      editionsContentMediator,
      volumesContentMediator,
      googleBooksContentMediator,
      hathitrustContentMediator,
      internetArchiveContentMediator,
      noteContentMediator,
      passthruContentMediator) {
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
