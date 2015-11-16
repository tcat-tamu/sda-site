(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleTocController', ArticleTocController);

   /** @ngInject */
   function ArticleTocController($stateParams, articleRepository) {
      var vm = this;

      vm.article = {};

      activate();

      function activate() {
         vm.article = articleRepository.get({ id: $stateParams.id });
      }
   }

})();
