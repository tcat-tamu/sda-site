(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('workAuthors', {
      templateUrl: 'app/components/work-authors/work-authors.html',
      bindings: {
        authors: '<'
      }
    });

})();
