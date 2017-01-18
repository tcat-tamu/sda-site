(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .component('personName', {
      templateUrl: 'app/research/components/person-name/person-name.html',
      bindings: {
        name: '<'
      }
    })

})();
