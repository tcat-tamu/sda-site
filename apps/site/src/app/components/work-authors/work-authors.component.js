(function () {
  'use strict';

  angular
    .module('sdaSite')
    .component('workAuthors', {
      templateUrl: 'app/components/work-authors/work-authors.html',
      bindings: {
        authors: '<'
      }
    });

})();
