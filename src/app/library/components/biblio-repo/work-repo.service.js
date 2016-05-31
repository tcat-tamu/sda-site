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

      var resource = $resource(uri, defaultParameters, actions)

      var repo = {};
      repo.query = search;
      repo.get = get;
      repo.resolveUri = resolveUri;
      return repo;

      function get(options, success, error) {
         return resource.get(options, success, error);
      }

      function search(options, success, error) {
         success = success || _.noop;
         error = error || _.noop;
         var params = _.pick(options, ['q', 'a', 't', 'aid', 'dr', 'off', 'max']);

         var items = [];
         var result = resource.get(params);
         result.$promise.then(function (data) {
            data.items.forEach(function (item) {
               items.push(item);
            });
            success(items);
         }, error);
         return items;
      }

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
