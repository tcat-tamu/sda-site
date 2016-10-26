(function () {
  'use strict';

  angular
    .module('sdaLibrary')
    .provider('trcSearch', TrcSearchProvider);

  /** @ngInject */
  function TrcSearchProvider() {
    var provider = {};
    provider.url = '/api/search';
    provider.$get = TrcSearchFactory;
    return provider;

    /** @ngInject */
    function TrcSearchFactory($http) {
      var resource = {};
      resource.search = search;
      return resource;

      function search(query) {
        var results = {};

        var resP = $http.get(provider.url, {
          params: {
            q: query
          }
        });

        var promise =  resP.then(function (res) {
          angular.merge(results, res.data);
          return res.data;
        });

        Object.defineProperty(results, '$promise', {
          value: promise
        });

        return results;
      }
    }
  }

})();
