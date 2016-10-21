(function () {
  'use strict';

  angular
    .module('vwise')
    .config(config);

  /** @ngInject */
  function config(googleBooksApiProvider) {
    googleBooksApiProvider.configure({ preventLoad: true });
  }

})();
