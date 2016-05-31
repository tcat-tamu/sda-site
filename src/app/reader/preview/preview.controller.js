(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderPreviewController', ReaderPreviewController);

   var TYPE_TITLE = {
      detailed: 'Detailed Article'
   };

   /** @ngInject */
   function ReaderPreviewController($stateParams, articleCollectionRepository, articleRepository, _, cslBuilder) {
      var vm = this;

      vm.node = null;
      vm.article = null;
      vm.links = [];
      vm.citations = [];
      vm.bibliography = [];
      vm.getThemeTitle = getThemeTitle;

      activate();

      function activate() {
         // TODO: fall back to larger articles until one is found
         articleCollectionRepository.get({ id: $stateParams.id, type: 'summary'}, onThematicNodeLoaded);
      }

      function getThemeTitle(type) {
         return TYPE_TITLE[type] || _.capitalize(type);
      }

      function onThematicNodeLoaded(node) {
         vm.node = node;
         vm.article = node.article;
         vm.links = _.values(node.links);

         var citations = vm.article.citations;
         var bibliography = _.indexBy(vm.article.bibliography, 'id');

         cslBuilder.renderBibliography(bibliography, citations, 'mla').then(function (bibView) {
            vm.bibliography = bibView.items;
            vm.citations = _.pluck(bibView.citations, 'html');
         });
      }
   }

})();
