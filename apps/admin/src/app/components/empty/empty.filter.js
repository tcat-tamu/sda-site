(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .filter('empty', emptyFilterFactory);

  /** @ngInject */
  function emptyFilterFactory(_) {
    return _.isEmpty;
  }

})();
