(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('relationships', {
      templateUrl: 'app/components/relationships/relationships.html',
      bindings: {
        relns: '<'
      }
    })

})();
