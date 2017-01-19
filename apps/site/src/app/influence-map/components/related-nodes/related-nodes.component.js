(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .component('relatedNodes', {
      templateUrl: 'app/influence-map/components/related-nodes/related-nodes.html',
      bindings: {
        related: '<',
        activate: '&'
      }
    })

})();
