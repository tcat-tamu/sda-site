/*global zotero:false*/
(function () {
  'use strict';

  angular
    .module('zotero')
    .factory('zotero', ZoteroFactory);

  /** @ngInject */
  function ZoteroFactory() {
    return new zotero(zotero.getDefaultBaseUrl(), angular.toJson);
  }

})();
