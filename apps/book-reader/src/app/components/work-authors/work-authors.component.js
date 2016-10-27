(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .component('workAuthors', {
      templateUrl: 'app/components/work-authors/work-authors.html',
      bindings: {
        authors: '<'
      }
    });

})();
