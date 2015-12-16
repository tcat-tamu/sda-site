(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ReaderPreviewController', ReaderPreviewController);

   /** @ngInject */
   function ReaderPreviewController($http, _) {
      var vm = this;

      vm.article = {};

      activate();

      function activate() {
         var articleP = $http.get('app/reader/article/article.json').then(_.property('data'));

         articleP.then(function (article) {
            vm.article = article;
         });
      }
   }

})();
