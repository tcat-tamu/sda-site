(function () {
   'use strict';

   angular
      .module('sda')
      .controller('AboutController', AboutController);

   /** @ngInject */
   function AboutController() {
      var vm = this;
      vm.showBanner = true;
   }

})();
