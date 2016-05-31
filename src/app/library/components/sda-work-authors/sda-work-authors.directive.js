(function () {
   'use strict';

   angular
      .module('sda.library')
      .directive('sdaWorkAuthors', sdaWorkAuthors);

   /** @ngInject */
   function sdaWorkAuthors() {
      var directive = {
         restrict: 'E',
         templateUrl: 'app/library/components/sda-work-authors/sda-work-authors.html',
         scope: {
            authors: '=ngModel'
         }
      };

      return directive;
   }

})();
