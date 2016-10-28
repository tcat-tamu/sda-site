(function () {
   'use strict';

   angular
      .module('sda.library')
      .directive('sdaDateLocation', sdaDateLocation);

   /** @ngInject */
   function sdaDateLocation() {
      var directive = {
         restrict: 'EA',
         templateUrl: 'app/library/components/sda-date-location/sda-date-location.html',
         scope: {
            dateLocation: '=ngModel'
         }
      };

      return directive;
   }
})();
