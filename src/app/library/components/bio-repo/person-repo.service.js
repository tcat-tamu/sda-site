(function () {
   'use strict';

   angular
      .module('sda.library')
      .factory('personRepository', PersonRepositoryFactory);

   /** @ngInject */
   function PersonRepositoryFactory($resource, config) {
      var uri = config.apiEndpoint + '/people/:id';

      var defaultParameters = {};

      var actions = {};

      var repo = $resource(uri, defaultParameters, actions);

      return repo;
   }

})();
