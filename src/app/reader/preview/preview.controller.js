(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderPreviewController', ReaderPreviewController);

   /** @ngInject */
   function ReaderPreviewController($stateParams, articleRepo) {
      var vm = this;

      vm.article = articleRepo.get($stateParams.id);
   }

})();
