(function () {
   'use strict';

   angular
      .module('sda.library')
      .factory('workRepository', WorkRepositoryFactory);

   /** @ngInject */
   function WorkRepositoryFactory($resource, config, _) {
      var uri = config.apiEndpoint + '/works/:id';

      var defaultParameters = {};

      var actions = {};

      var repo = $resource(uri, defaultParameters, actions);

      repo.resolveUri = resolveUri;

      return repo;

      /**
      * Resolves an entity URI into a work, an edition, or a vo`lume.
      *
      * @param {string} uri
      * @param {boolean} [rejectOnFailure=false]
      * @return {Promise.<{entity: object, edition: object=, work: object=, type: string}>}
      */
      function resolveUri(uri, rejectOnFailure) {
         var uriParts = uri.match(/^works\/([^\/]+)(?:\/editions\/([^\/]+)(?:\/volumes\/([^\/]+))?)?$/i);
         var workId = uriParts[1];
         var editionId = uriParts[2];
         var volumeId = uriParts[3];

         var work = repo.get({ id: workId });

         return work.$promise.then(resolveEntity, function (err) {
            if (rejectOnFailure) {
               throw new Error('unable to find work ' + workId + ': ' + err.message);
            } else {
               return null;
            }
         });

         function resolveEntity(work) {
            if (editionId) {
               var edition = _.findWhere(work.editions, { id: editionId });
               if (edition) {
                  if (volumeId) {
                     var volume = _.findWhere(edition.volumes, { id: volumeId });
                     if (volume) {
                        return {
                           entity: volume,
                           volume: volume,
                           edition: edition,
                           work: work,
                           type: 'volume'
                        };
                     } else {
                        if (rejectOnFailure) {
                           throw new Error('unable to find volume ' + volumeId + ' on edition ' + editionId + ' on work ' + workId);
                        } else {
                           return null;
                        }
                     }
                  } else {
                     return {
                        entity: edition,
                        edition: edition,
                        work: work,
                        type: 'edition'
                     };
                  }
               } else {
                  if (rejectOnFailure) {
                     throw new Error('unable to find edition ' + editionId + ' on work ' + workId);
                  } else {
                     return null;
                  }
               }
            } else {
               return {
                  entity: work,
                  work: work,
                  type: 'work'
               };
            }
         }
      }
   }

})();
