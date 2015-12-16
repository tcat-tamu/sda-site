(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderPreviewController', ReaderPreviewController);

   var TYPE_TITLE = {
      detailed: 'Detailed Article'
   };

   /** @ngInject */
   function ReaderPreviewController($http, _) {
      var vm = this;

      vm.article = {};
      vm.getThemeTitle = getThemeTitle;

      activate();

      function activate() {
         var articleP = $http.get('app/reader/article/article.json').then(_.property('data'));

         articleP.then(function (article) {
            vm.article = article;
         });
      }

      function getThemeTitle(type) {

         return TYPE_TITLE[type] || _.capitalize(type);
      }
   }

})();
