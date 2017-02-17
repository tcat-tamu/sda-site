(function () {
  'use strict';

  angular
    .module('sdaSite')
    .filter('trusted', TrustedFilterFactory);

  /** @ngInject */
  function TrustedFilterFactory($sce) {
    return trustFilter;

    function trustFilter(url) {
      return $sce.trustAsResourceUrl(url);
    }
  }

})();
