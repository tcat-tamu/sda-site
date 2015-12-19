/**
* Simple relationship data model
*
* @typedef SimpleRelationship
* @type {object}
* @property {string} title
* @property {object} entity
* @property {string} type
*/

(function () {
   'use strict';

   angular
      .module('sda.library')
      .controller('LibraryBookController', LibraryBookController);

   /** @ngInject */
   function LibraryBookController($stateParams, workRepository, copyRefRepository, relationshipRepository, $q, _) {
      var vm = this;

      var typesQ = $q.defer();

      vm.work = null;
      vm.copyRefs = [];

      activate();

      function activate() {
         vm.work = workRepository.get({ id: $stateParams.workId }, onWorkLoaded);
         relationshipRepository.queryTypes({}, function (ts) {
            typesQ.resolve(ts);
         });
      }

      function onWorkLoaded(work) {
         copyRefRepository.queryByWork({ workId: work.id }, onCopyRefsLoaded);
         relationshipRepository.query({ entity: 'works/' + work.id }, onRelationshipsLoaded);
      }

      function onCopyRefsLoaded(copyRefs) {
         var crMap = _.indexBy(copyRefs, 'associatedEntry');

         vm.work.copyRef = crMap['works/' + vm.work.id];
         if (vm.work.editions) {
            vm.work.editions.forEach(function (edition) {
               edition.copyRef = crMap['works/' + vm.work.id + '/editions/' + edition.id];
               if (edition.volumes) {
                  edition.volumes.forEach(function (volume) {
                     volume.copyRef = crMap['works/' + vm.work.id + '/editions/' + edition.id + '/volumes/' + volume.id];
                  });
               }
            });
         }
      }

      function onRelationshipsLoaded(relationships) {
         typesQ.promise.then(function (types) {
            var promises = _.chain(relationships)
               .map(simplifyRelationship).flatten()
               .value();

            $q.all(promises).then(function (simpleRelationships) {
               vm.relationships = _.compact(simpleRelationships);
            });

            /**
             * Simplifies relationship domain model into simple relationships for display
             *
             * @param  {Relationship} relationship
             * @return {Promise.<SimpleRelationship>[]}
             */
            function simplifyRelationship(relationship) {
               var type = _.findWhere(types, { identifier: relationship.typeId });

               var isReverse = relationship.targetEntities.some(function (target) {
                  return _.contains(target.entryUris, 'works/' + vm.work.id);
               });

               var title = (isReverse && type.isDirected) ? type.reverseTitle : type.title;
               var anchors = isReverse ? relationship.relatedEntities : relationship.targetEntities;

               return _.chain(anchors)
                  .pluck('entryUris').flatten()
                  .map(function (uri) {
                     // NOTE: the following might return null if URI cannot be resolved
                     return workRepository.resolveUri(uri, false);
                  })
                  .map(assignTitle)
                  .value();

               function assignTitle(simpleRelationshipP) {
                  return simpleRelationshipP.then(function (simpleRelationship) {
                     if (simpleRelationship) {
                        simpleRelationship.title = title;
                     }
                     return simpleRelationship;
                  });
               }

            }
         });

      }
   }

})();
