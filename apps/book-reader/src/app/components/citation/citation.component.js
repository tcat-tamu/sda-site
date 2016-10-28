(function () {
  'use strict';

  angular
    .module('sdaBookReader')
    .component('citation', {
      templateUrl: 'app/components/citation/citation.html',
      bindings: {
        authors: '<',
        title: '<',
        pubInfo: '<',
        edition: '<',
        volume: '<'
      }
    })

})();
