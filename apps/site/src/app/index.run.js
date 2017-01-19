(function () {
  'use strict';

  angular
    .module('sdaSite')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, analytics) {
    $rootScope.$on('$stateChangeSuccess', function () {
      analytics('send', 'pageview', {
        page: $location.url()
      });
    });
  }

})();
