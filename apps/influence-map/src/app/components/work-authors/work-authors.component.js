(function () {
  'use strict';

  angular
    .module('sdaConceptBrowser')
    .component('workAuthors', {
      templateUrl: 'app/components/work-authors/work-authors.html',
      bindings: {
        authors: '<'
      }
    });

})();
