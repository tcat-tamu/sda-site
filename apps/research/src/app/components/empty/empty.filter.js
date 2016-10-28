(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .filter('empty', isEmptyFactory);

  function isEmptyFactory(_) {
    return _.isEmpty;
  }

})();
