(function () {
  'use strict';

  angular
    .module('sdaReader')
    .config(config);

  function config(categorizationRepoProvider) {
    var BASE_URL = '/api/catalog';

    categorizationRepoProvider.url = BASE_URL + '/categorizations';
  }

})();
