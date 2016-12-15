(function () {
  'use strict';

  angular
    .module('zotero')
    .component('zoteroEditor', {
      templateUrl: 'app/zotero/editor.html',
      controller: ZoteroEditorController,
      bindings: {
        item: '=',
        typeFilter: '<types'
      }
    });

  /** @ngInject */
  function ZoteroEditorController($q, sdaToast, zotero) {
    var vm = this;

    vm.itemTypeSearchText = '';
    vm.itemType = null;

    vm.types = [];
    vm.fields = [];
    vm.roles = [];

    vm.selectType = selectType;

    activate();

    function activate() {
      zotero.getItemTypes().then(function (types) {
        vm.types = (vm.typeFilter && vm.typeFilter.length > 0)
          ? types.filter(function (field) {
              return vm.typeFilter.indexOf(field.id) >= 0;
            })
          : types;
      }, function () {
        sdaToast.error('Unable to load item type info');
      });

      if (!vm.item.creators) {
        vm.item.creators = [{}];
      }

      if (vm.item.creators.length === 0) {
        vm.item.creators.push({});
      }
    }

    function selectType(itemType) {
      if (!itemType) {
        vm.item.itemType = null;
        vm.fields = [];
        vm.roles = [];
        return;
      }

      vm.item.itemType = itemType.id;

      var fieldsP = itemType.getFields()
      fieldsP.then(function (fields) {
        vm.fields = fields;
      });

      var creatorRolesP = itemType.getCreatorRoles();
      creatorRolesP.then(function (roles) {
        vm.roles = roles;
      });

      $q.all([fieldsP, creatorRolesP]).catch(function () {
        sdaToast.error('Unable to load data for the "' + itemType.label + '" type.');
      });
    }
  }

})();
