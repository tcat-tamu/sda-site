(function () {
  'use strict';

  angular
    .module('sdaHome')
    .component('sdaNav', {
      templateUrl: 'app/home/components/sda-nav/sda-nav.html',
      bindings: {
        modules: '<'
      }
    });

})();
