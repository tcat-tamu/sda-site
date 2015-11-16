(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleShowController', ArticleShowController);

   /** @ngInject */
   function ArticleShowController($stateParams, articleRepository) {
      var vm = this;

      vm.article = {};

      activate();

      function activate() {
         vm.article = articleRepository.get({ id: $stateParams.id });
      }
   }

})();
