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
      vm.node = {};
      vm.article = {};
      vm.articleType = 'summary';
      vm.citations = [];
      vm.bibliography = [];
      vm.getThemeTitle = getThemeTitle;

      activate();

      function activate() {
         vm.collection = articleCollectionRepository.get({}, onCollectionLoaded);
      }

      function getThemeTitle(type) {
         return TYPE_TITLE[type] || _.capitalize(type);
      }

      function onCollectionLoaded() {
         vm.node = findSubCollection($stateParams.id);
         // TODO: fall back to larger articles until one is found
         var article = _.findWhere(vm.node.articles, { type: vm.articleType });

         if (article) {
            vm.article = articleRepository.get({ id: article.id }, onArticleLoaded);
         }
      }

      function onArticleLoaded(article) {
         var citations = article.citations;
         var bibliography = _.indexBy(article.bibliography, 'id');

         cslBuilder.renderBibliography(bibliography, citations, 'mla').then(function (bibView) {
            vm.bibliography = bibView.items;
            vm.citations = _.pluck(bibView.citations, 'html');
         });
      }


        /**
         * BFS for collection node with given ID
         *
         * @param string id
         * @return Node
         */
        function findSubCollection(id) {
            var worklist = [vm.collection];

            while (worklist.length > 0) {
                var node = worklist.shift();

                if (!node) {
                   continue;
                }

                if (node.id === id) {
                    return node;
                } else if (node.children) {
                    worklist = worklist.concat(node.children);
                }
            }

            return null;
        }
   }

})();
