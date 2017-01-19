(function () {
  'use strict';

  angular
    .module('sdaReader')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope) {
    // enable nested scrollspy behavior
    $rootScope.$on('duScrollspy:becameActive', function($event, $element){
      $element.parents('li').addClass('active');
    });

    $rootScope.$on('duScrollspy:becameInactive', function($event, $element){
      $element.parents('li').removeClass('active');
    });
  }

})();
