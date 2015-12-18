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

      vm.collection = {};
      vm.article = {};
      vm.articleType = 'summary';
      vm.citations = [];
      vm.bibliography = [];
      vm.getThemeTitle = getThemeTitle;

      activate();

      function activate() {
         vm.collection = articleCollectionRepository.get({ id: $stateParams.id }, onCollectionLoaded);
      }

      function getThemeTitle(type) {
         return TYPE_TITLE[type] || _.capitalize(type);
      }

      function onCollectionLoaded(collection) {
         // TODO: fall back to larger articles until one is found
         var article = _.findWhere(collection.articles, { type: vm.articleType });

         if (article) {
            vm.article = articleRepository.get({ id: article.id }, onArticleLoaded);
         }
      }

      function onArticleLoaded(article) {
         var citations = article.citations;
         var bibliography = _.indexBy(article.bibliography, 'id');

         cslBuilder.renderBibliography(bibliography, citations, 'mla').then(function (bibView) {
            console.log(bibView);
            vm.bibliography = bibView.items;
            vm.citations = _.pluck(bibView.citations, 'html');
         });
      }
   }

})();
