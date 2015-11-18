(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleController', ArticleController);

   /** @ngInject */
   function ArticleController($stateParams, articleRepository, $anchorScroll, $timeout) {
      var vm = this;

      vm.article = {};
      vm.toc = [];
      vm.scrollTo = scrollTo;

      activate();

      function activate() {
         vm.article = articleRepository.get({ id: $stateParams.id }, function () {
            if ($stateParams.scrollTo) {
               // give page time to render before scrolling to target
               $timeout(function () {
                  scrollTo($stateParams.scrollTo);
               });
            }
         });
      }

      function scrollTo(id, $event) {
         if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
         }

         $anchorScroll(id);
      }
   }

})();
