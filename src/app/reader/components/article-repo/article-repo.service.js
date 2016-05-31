(function () {
   'use strict';

   angular
      .module('sda.reader')
      .factory('articleRepository', articleRepositoryFactory);

   /** @ngInject */
   function articleRepositoryFactory($resource, config, articleMock, $timeout) {

      // HACK: mock data retrieval for demo
      return {
         get: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};

            if (opts.id) {
               $timeout(function () { cb(articleMock); });
               return articleMock
            } else {
               return null;
            }
         }
      }


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
