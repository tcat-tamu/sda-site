(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .component('relatedNodes', {
      templateUrl: 'app/components/related-nodes/related-nodes.html',
      bindings: {
        related: '<',
        activate: '&'
      }
    })

})();
