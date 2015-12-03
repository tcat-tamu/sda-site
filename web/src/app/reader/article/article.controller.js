(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleController', ArticleController);

   /** @ngInject */
   function ArticleController($state, $stateParams, articleRepository, $document, $timeout, $http) {
      var vm = this;

      // HACK: calculate scroll offset based on rem value and header-height
      var rem = 16;
      var headerHeight = 4*rem;
      vm.scrollOffset = headerHeight + 1*rem;

      vm.article = {};
      vm.toc = [];
      vm.scrollTo = scrollTo;
      vm.scrollToTop = scrollToTop;
      vm.activateNote = activateNote;

      activate();

      function activate() {
         // vm.article = articleRepository.get({ id: $stateParams.id }, function () {
         //    initScroll();
         // });

         // HACK: static content for development purposes
         $http.get('app/reader/article/article.json').then(function (resp) {
            vm.article = resp.data;
            initScroll();
         });
      }

      /**
       * Set initial scroll position on the page.
       *
       * Should be called after the article has been loaded.
       */
      function initScroll() {
         if ($stateParams.scrollTo) {
            // give page time to render before scrolling to target
            $timeout(function () {
               if ($stateParams.scrollTo.match(/footnote/)) {
                  var note = _.findWhere(vm.article.footnotes, {backlinkId: $stateParams.scrollTo});
                  if (note) {
                     activateNote(note);
                  }
               } else {
                  scrollTo($stateParams.scrollTo, false)
               }
            });
         }
      }

      function scrollTo(id, animated, $event) {
         if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
         }

         var target = angular.element('#' + id);
         if (animated) {
            $document.duScrollToElementAnimated(target, vm.scrollOffset);
         } else {
            $document.duScrollToElement(target, vm.scrollOffset);
         }
      }

      function scrollToTop(animated, $event) {
         if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
         }

         if (animated) {
            $document.duScrollTopAnimated(0);
         } else {
            $document.duScrollTop(0);
         }
      }

      function activateNote(note) {
         vm.article.notes.forEach(function (note) {
            note.active = false;
         });

         note.active = true;
      }
   }

})();
