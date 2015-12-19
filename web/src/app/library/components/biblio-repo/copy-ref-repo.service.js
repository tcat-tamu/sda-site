(function () {
   'use strict';

   angular
      .module('sda.library')
      .factory('copyRefRepository', CopyRefRepositoryFactory);

   /** @ngInject */
   function CopyRefRepositoryFactory($resource, config) {
      var uri = config.apiEndpoint + '/copies/';

      var defaultParameters = {};

      var actions = {
         queryByWork: { method: 'GET', url: uri + 'works/:workId/', isArray: true },
         queryByEdition: { method: 'GET', url: uri + 'works/:workId/editions/:editionId/', isArray: true },
         queryByVolume: { method: 'GET', url: uri + 'works/:workId/editions/:editionId/volumes/:volumeId/', isArray: true }
      };

      var repo = $resource(uri + ':id', defaultParameters, actions);

      return repo;
   }

})();
