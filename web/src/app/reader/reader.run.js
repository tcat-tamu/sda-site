(function () {
   'use strict';

   angular
      .module('sda.reader')
      .run(runBlock);

   /** @ngInject */
   function runBlock($log, $rootScope, duScrollActiveClass) {
      // enable nested scrollspy behavior
      $rootScope.$on('duScrollspy:becameActive', function($event, $element){
         $element.parents('li').addClass(duScrollActiveClass);
      });

      $rootScope.$on('duScrollspy:becameInactive', function($event, $element){
         $element.parents('li').removeClass(duScrollActiveClass);
      });
   }

})();
