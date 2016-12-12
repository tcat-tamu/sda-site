(function () {
  'use strict';

  angular
    .module('trcGraph')
    .provider('graphRepo', graphRepoProvider);

  function graphRepoProvider() {
    var provider = {};
    provider.url = '/api/graph';
    provider.$get = graphRepoFactory;
    return provider;

    /** @ngInject */
    function graphRepoFactory($resource) {
      var restResource = $resource(provider.url + '/:type');

      var repo = {};
      repo.get = getGraph;
      return repo;

      /**
       * Retrieves a graph by type identifier
       *
       * @param  {string} type
       * @return {Graph}
       */
      function getGraph(type) {
        return restResource.get({ type: type });
      }
    }
  }

})();
