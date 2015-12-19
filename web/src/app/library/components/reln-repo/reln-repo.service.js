/**
* Pronenance metadata
*
* @typedef Provenance
* @type {object}
* @property {string[]} creatorUris
* @property {string} dateCreated
* @property {string} dateModified
*/

/**
* Anchor container for one or more referenced entities
*
* @typedef Anchor
* @type {object}
* @property {string[]} entryUris
*/

/**
* Relationship domain model
*
* @typedef Relationship
* @type {object}
* @property {string} id
* @property {string} typeId
* @property {Provenance} provenance
* @property {Anchor[]} relatedEntities
* @property {Anchor[]} targetEntities
* @property {string} description
* @property {string} descriptionMimeType
*/

(function () {
   'use strict';

   angular
      .module('sda.library')
      .factory('relationshipRepository', RelationshipRepositoryFactory);

   /** @ngInject */
   function RelationshipRepositoryFactory($resource, config) {
      var uri = config.apiEndpoint + '/relationships/';

      var defaultParameters = {};

      var actions = {
         queryTypes: { method: 'GET', url: uri + 'types', isArray: true }
      };

      var repo = $resource(uri + ':id', defaultParameters, actions);

      return repo;
   }

})();
