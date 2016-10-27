(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .component('workInfo', {
      templateUrl: 'app/components/work-info/work-info.html',
      bindings: {
        work: '<',
        related: '<',
        activate: '&'
      }
    })

})();
