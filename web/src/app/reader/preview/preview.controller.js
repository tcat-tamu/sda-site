(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderPreviewController', ReaderPreviewController);

   var TYPE_TITLE = {
      detailed: 'Detailed Article'
   };

   /** @ngInject */
   function ReaderPreviewController($stateParams, articleCollectionRepository, articleRepository, $http, _) {
      var vm = this;

      vm.collection = {};
      vm.article = {};
      vm.articleType = 'summary';
      vm.getThemeTitle = getThemeTitle;

      activate();

      function activate() {
         vm.collection = articleCollectionRepository.get({ id: $stateParams.id }, function (collection) {
            // TODO: fall back to larger articles until one is found
            var article = _.findWhere(collection.articles, { type: vm.articleType });

            if (article) {
               vm.article = articleRepository.get({ id: article.id });
            }
         });
      }

      function getThemeTitle(type) {
         return TYPE_TITLE[type] || _.capitalize(type);
      }
   }

})();
