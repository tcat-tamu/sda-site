(function () {
   'use strict';

   angular
      .module('sda.reader')
      .factory('articleCollectionRepository', articleCollectionRepositoryFactory);

   /** @ngInject */
   function articleCollectionRepositoryFactory($resource, config, taxonomyMock, articleRepository, $timeout) {

      // HACK: mock data retrieval for demo
      return {
         get: function (opts, cb) {
            opts = opts || {};
            cb = cb || function () {};

            if (opts.id) {
               var node = findSubCollection(opts.id);
               if (!node) {
                  return null;
               }

               if (opts.type) {
                  // emulate GET /articles/collections/thematic/:id/:type
                  var articleRef = node.articles[opts.type];
                  if (!articleRef) {
                     return null;
                  }

                  var thematicData = {
                     id: node.id,
                     links: node.articles,
                     article: articleRepository.get({ id: articleRef.id })
                  };

                  $timeout(function () { cb(thematicData); });
                  return thematicData;
               } else {
                  // emulate GET /articles/collections/thematic/:id
                  $timeout(function () { cb(node); });
                  return node;
               }
            } else {
               // emulate GET /articles/collections/thematic
               $timeout(function () { cb(taxonomyMock); });
               return taxonomyMock;
            }
         }
      };


      /**
       * BFS for collection node with given ID
       *
       * @param string id
       * @return Node
       */
      function findSubCollection(id) {
         var worklist = [taxonomyMock.root];

         while (worklist.length > 0) {
            var node = worklist.shift();

            if (!node) {
               continue;
            }

            if (node.id === id) {
               return node;
            } else if (node.children) {
               worklist = worklist.concat(node.children);
            }
         }

         return null;
      }



      var uri = config.apiEndpoint + '/articles/collections/:collection/:id/:type';

      var defaultParameters = {
         collection: 'thematic'
      };

      var actions = {};

      var repo = $resource(uri, defaultParameters, actions);

      return repo;
   }

})();
