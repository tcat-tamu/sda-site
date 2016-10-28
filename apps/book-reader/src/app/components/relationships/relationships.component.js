(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .component('relationships', {
      templateUrl: 'app/components/relationships/relationships.html',
      bindings: {
        relns: '<'
      }
    })

})();
