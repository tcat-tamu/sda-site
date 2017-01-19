(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .controller('AboutEditorSectionController', AboutEditorSectionController);

  /** @ngInject */
  function AboutEditorSectionController($state) {
    var vm = this;

    vm.editAboutPage = editAboutPage;

    // PUBLIC METHODS

    function editAboutPage(page) {
      $state.go('about.edit', { id: page.id });
    }
  }

})();
