(function () {
   'use strict';

   angular
      .module('sdaReader')
      .controller('PreviewController', PreviewController);

   /** @ngInject */
   function PreviewController(article) {
      var vm = this;

      vm.article = article;
   }

})();
