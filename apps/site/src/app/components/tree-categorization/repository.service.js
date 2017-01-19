(function () {
  'use strict';

  angular
    .module('sdaSite')
    .provider('categorizationService', categorizationRepoProvider);

  var Strategies = {
    set: "set",
    list: "list",
    tree: "hierarchical"
  };

  function categorizationRepoProvider() {
    var provider = {};
    provider.url = '/api/categorizations';
    provider.$get = categorizationRepoFactory;
    return provider;

    /** @ngInject */
    function categorizationRepoFactory($q, $resource, $http) {
      var repo = {
        getScopedRepo: getScopedRepo
      };

      var schemesResource = $resource(provider.url + '/:scopeId/:key', {
        key: '@key'
      });
      var nodeResource = $resource(provider.url + '/:scopeId/:schemeId/nodes/:nodeId', {
        schemeId: '@schemeId',
        nodeId: '@nodeId'
      });
      var nodeChilrenResource = $resource(provider.url + '/:scopeId/:schemeId/nodes/:nodeId/children', {
        schemeId: '@schemeId',
        nodeId: '@nodeId'
      });
      var associatedEntryResource = $resource(provider.url + '/:scopeId/:schemeId/nodes/:nodeId/entryRef', {
        schemeId: '@schemeId',
        nodeId: '@nodeId'
      }, {
        update: {
          method: 'PUT'
        }
      });


      // REPO API DEFN goes here
      return repo;

      function getScopedRepo(scopeId) {
        return new ScopedRepository(scopeId);
      }

      /**
       * Creates a new ScopedRepository.
       *
       * @param {string} scopeId The scope id that will be used by this
       *                         repository
       * @constructor
       * @classdesc The primary API for working with categorizations. Categorizations
       * are defined relative to a scope id.
       *
       * TODO explain why here.
       */
      function ScopedRepository(scopeId) {

        this.get = getCategorization;
        this.create = createCategorization;
        this.remove = removeCategorization;

        this.nodes = {
          get: getNode,
          getChildren: getNodeChildren,

          create: createNode,
          move: moveNode,
          remove: removeNode,
          update: updateNode,
          link: linkEntry,
          unlink: unlinkEntry
        };

        /* ================================
         * ScopedRepository API METHODS
         * ================================ */

        function getCategorization(key) {
          // HACK: load from local file. Note that this does not match the eventual behavior of the resource-backed API
          // return $http.get('app/trc-core/categorizations/overviews.json').then(function(response) { return response.data; });
          return schemesResource.get({scopeId: scopeId, key: key });
        }

        function createCategorization(key, label, description, type) {
          // TODO convert to object
          // TODO VERIFY KEY, check uniqueness
          var data = {
            key: key,
            label: label,
            description: description,
            type: type
          }
        }

        function removeCategorization(key) {

        }

        function getNode(schemeId, nodeId) {

        }

        function getNodeChildren(node) {

        }

        function createNode(parent, label, description) {
          var options = {
            scopeId: scopeId,
            schemeId: parent.schemeId,
            nodeId: parent.id
          };
           var data = {
            label: label,
            description: description
          };

          var result = nodeChilrenResource.save(options, data);
          result.$promise.then(function(node) {
            parent.childIds.push(node.id);
            parent.children.push(node);
          });

          return result;
        }


        /**
         * [removeNode description]
         * @param  {[type]} node       [description]
         * @param  {boolean} removeRefs [description]
         * @return {[type]}            [description]
         */
        function removeNode(node, removeRefs, parent) {
          var result = nodeResource.delete({
            scopeId: scopeId,
            schemeId: node.schemeId,
            nodeId: node.id,
            remove_refs: !!removeRefs
          });

          if (parent) {
            // remove child from parent node
            result.$promise.then(function () {
              var ix = parent.children.indexOf(node)
              if (ix >= 0) {
                parent.children.splice(ix, 1);
              }
            });
          }

          return result.$promise;
        }
        function moveNode() {

        }


        function updateNode() {

        }

        function linkEntry(node, entryRef) {
          var params = {
            scopeId: scopeId,
            schemeId: node.schemeId,
            nodeId: node.id
          };

          var result = associatedEntryResource.update(params, entryRef);
          result.$promise.then(function(ref) {
            node.entryRef = ref;
          });

          return result;
        }

        function unlinkEntry() {
          var params = {
            scopeId: scopeId,
            schemeId: node.schemeId,
            nodeId: node.id
          };

          var result = associatedEntryResource.delete(params);
          result.$promise.then(function() {
            node.entryRef = null;
          });

          return result;
        }

      }
    }
  }
})();
