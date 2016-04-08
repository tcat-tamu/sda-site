(function () {
   'use strict';

   angular
      .module('sda.library')
      .factory('copyRefRepository', CopyRefRepositoryFactory);

   /** @ngInject */
   function CopyRefRepositoryFactory($resource, config) {
      var defaultParams = {
         copyId: '@id'
      };

      var actions = {
         update: {
            method: 'PUT'
         }
      }

      var r1 = $resource(config.apiEndpoint + '/works/:workId/copies/:copyId', defaultParams, actions);
      var r2 = $resource(config.apiEndpoint + '/works/:workId/editions/:editionId/copies/:copyId', defaultParams, actions);
      var r3 = $resource(config.apiEndpoint + '/works/:workId/editions/:editionId/volumes/:volumeId/copies/:copyId', defaultParams, actions);

      var repo = {};
      repo.get = get;
      return repo;

      function get(options) {
         var resource = getResource(options);
         return resource.get(options);
      }

      function getResource(opts) {
         opts = opts || {};

         if (opts.workId && opts.editionId && opts.volumeId) {
            return r3;
         } else if (opts.workId && opts.editionId) {
            return r2;
         } else if (opts.workId) {
            return r1;
         }

         throw new Error('Expected work ID and optionally edition and volume ID options, but found none');
      }
   }

})();
