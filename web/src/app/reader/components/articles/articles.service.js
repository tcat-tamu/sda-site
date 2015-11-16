(function () {
   'use strict';

   angular
      .module('sda.reader')
      .factory('articleRepository', articleRepositoryFactory);

   /** @ngInject */
   function articleRepositoryFactory($resource, config) {
      var repo = $resource(config.apiEndpoint + '/articles/:id', {}, {
         search: { method: 'GET' }
      });
      return repo;
   }

})();
