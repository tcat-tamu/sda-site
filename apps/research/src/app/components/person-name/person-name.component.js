(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('personName', {
      templateUrl: 'app/components/person-name/person-name.html',
      bindings: {
        name: '<'
      }
    })

})();
