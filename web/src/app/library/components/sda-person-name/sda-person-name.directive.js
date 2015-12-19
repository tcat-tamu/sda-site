(function () {
   'use strict';

   angular
      .module('sda.library')
      .directive('sdaPersonName', sdaPersonName);

   /** @ngInject */
   function sdaPersonName() {
      var directive = {
         restrict: 'EA',
         templateUrl: 'app/library/components/sda-person-name/sda-person-name.html',
         scope: {
            name: '=ngModel'
         }
      };

      return directive;
   }
})();
