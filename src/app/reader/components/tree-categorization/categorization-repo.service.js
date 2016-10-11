(function () {
   'use strict';

   // HACK this is an impoverished version of the (unfinished) TRC ategorizationService from the SDA Admin site

   angular
      .module('sda.reader')
      .provider('categorizationRepo', categorizationRepoProvider)

   function categorizationRepoProvider() {
      var provider = {};
      provider.url = '/api/categorizations';
      provider.$get = categorizationRepoFactory;
      return provider;

      /** @ngInject */
      function categorizationRepoFactory($resource) {
         var schemeResource = $resource(provider.url + '/:scopeId/:key', {
            key: '@key'
         });

         var repo = {};
         repo.get = getCategorization;
         return repo;

         function getCategorization(scopeId, key) {
            return schemeResource.get({
               scopeId: scopeId,
               key: key
            });
         }
      }
   }

})();
