(function () {
   'use strict';

   angular
      .module('sda.reader')
      .provider('articleRepo', articleRepoProvider);

   function articleRepoProvider() {
      var provider = {}
      provider.url = '/api/articles';
      provider.$get = articleRepoFactory;
      return provider;

      /** @ngInject */
      function articleRepoFactory($resource) {
         var articleResource = $resource(provider.url + '/:id', {
            id: '@id'
         });

         var repo = {};
         repo.getReferencesEndpoint = getReferencesEndpoint;
         repo.get = getArticle;
         return repo;

         function getReferencesEndpoint(id) {
            return provider.url + '/' + id + '/references';
         }

         function getArticle(id) {
            return articleResource.get({ id: id });
         }

      }
   }

})();
