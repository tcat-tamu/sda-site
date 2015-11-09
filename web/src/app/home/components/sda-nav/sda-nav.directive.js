(function () {
   'use strict';

   angular
      .module('sda.home')
      .directive('sdaNav', sdaNav);

   /** @ngInject */
   function sdaNav() {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/home/components/sda-nav/sda-nav.html',
         transclude: true,
         replace: true,
         scope: {},
         bindToController: true,
         controller: MainNavController,
         controllerAs: 'vm'
      };

      return directive;

      /** @ngInject */
      function MainNavController() {
         var vm = this;

         vm.modules = [];
         vm.setActive = setActive;
         vm.add = addModule;

         function setActive(module) {
            vm.modules.forEach(function (m) {
               m.active = false;
            });

            module.active = true;
         }

         function addModule(module) {
            if (vm.modules.length === 0) {
               setActive(module);
            }

            vm.modules.push(module);
         }
      }
   }

})();
