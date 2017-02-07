(function () {
  'use strict';

  angular
    .module('sdaHome')
    .component('sdaBillboard', {
      templateUrl: 'app/home/components/sda-billboard/sda-billboard.html',
      bindings: {
        slides: '<'
      }
    });

})();
