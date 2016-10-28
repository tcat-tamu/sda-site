(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('dateLocation', {
      templateUrl: 'app/components/date-location/date-location.html',
      bindings: {
        event: '<'
      }
    });

})();
