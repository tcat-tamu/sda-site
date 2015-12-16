(function () {
   'use strict';

   angular
      .module('sda.reader')
      .factory('articleRepository', articleRepositoryFactory);

   /** @ngInject */
   function articleRepositoryFactory($resource, config) {
      var uri = config.apiEndpoint + '/articles/:id';

      var defaultParameters = {};

      var actions = {
         search: {
            method: 'GET'
         }
      };

      var repo = $resource(uri, defaultParameters, actions);

      return repo;
   }

})();
