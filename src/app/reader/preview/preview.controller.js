(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderPreviewController', ReaderPreviewController);

   var TYPE_TITLE = {
      detailed: 'Detailed Article'
   };

   /** @ngInject */
   function ReaderPreviewController($stateParams, articleCollectionRepository, articleRepository, _, referenceRenderer) {
      var vm = this;

      vm.node = null;
      vm.article = null;
      vm.links = [];
      vm.citations = null;
      vm.bibliography = null;
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

         // TODO: where is this supposed to be used?
         // referenceRenderer.render('modern-language-association', vm.article.references).then(function (rendered) {
         //    vm.citations = rendered.citations;
         //    vm.bibliography = rendered.bibliography;
         // });
      }
   }

})();
