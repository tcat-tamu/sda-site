(function () {
   'use strict';

   angular
      .module('sda.reader')
      .factory('articleCollectionRepository', articleCollectionRepositoryFactory);

   /** @ngInject */
   function articleCollectionRepositoryFactory($resource, config) {
      var uri = config.apiEndpoint + '/articles/collections/:type/:id';

      var defaultParameters = {
         type: 'thematic'
      };

      var actions = {};

      var repo = $resource(uri, defaultParameters, actions);

      return repo;
   }

})();
