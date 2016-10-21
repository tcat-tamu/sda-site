(function () {
  'use strict';

  angular
    .module('zotero')
    .component('zoteroCreatorField', {
      templateUrl: 'app/zotero/creator-field.html',
      controller: ZoteroCreatorFieldController,
      bindings: {
        creator: '=',
        roles: '<'
      }
    });

  /** @ngInject */
  function ZoteroCreatorFieldController() {
  }

})();
