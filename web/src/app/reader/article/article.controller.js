(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleController', ArticleController);

   /** @ngInject */
   function ArticleController($stateParams, articleRepository, $document, $timeout) {
      var vm = this;

      // HACK: calculate scroll offset based on rem value and header-height
      var rem = 16;
      var headerHeight = 4*rem;
      vm.scrollOffset = headerHeight + 1*rem;

      vm.article = {};
      vm.toc = [];
      vm.activeTab = 'contents';
      vm.scrollTo = scrollTo;
      vm.scrollToTop = scrollToTop;
      vm.activateNote = activateNote;

      activate();

      function activate() {
         vm.article = articleRepository.get({ id: $stateParams.id }, function () {
            if ($stateParams.scrollTo) {
               // give page time to render before scrolling to target
               $timeout(function () {
                  scrollTo($stateParams.scrollTo, false)
               });
            }

            vm.article.author = 'John Doe';

            vm.article.notes = [
               {
                  active: false,
                  note: 'Theistic evolution by way of radiation (discussed earlier) is the major exception.  Genetic mutations are the means of amplification in that case.  Another good example is the amplification of photons in the mammalian eye (Ellis 2001, 260).'
               },
               {
                  active: false,
                  note: 'The theory of how parts relate to their wholes.'
               },
               {
                  active: false,
                  note: 'As Nancey Murphy points out, Peacocke uses ‘boundary condition’ in a variety of ways and seems to think of it as an analogy rather than a strict scientific property (2008, 116).  Some of these uses are more viable than others.  For example the universe is not like ball or rigid body; it has no proper boundary (Russell 2008a, 136–137). In fact, if the overall geometry of spacetime is hyperbolic, which now seems likely, then space itself is infinite.  It has no edge or boundary to interact with.'
               },
               {
                  active: false,
                  note: 'This is one way of construing scientific realism.  Anti-realists do not grant that theories ever need to be true in order to be useful or widely agreed upon.'
               },
               {
                  active: false,
                  note: 'Among the many examples, see (Clayton 1997, 206), (Saunders 2000, 254).'
               },
               {
                  active: false,
                  note: '\\( \\displaystyle \\int \\mathrm{e}^x \\,\\mathrm{d}x = \\mathrm{e}^x + C \\)'
               },
               {
                  active: false,
                  note: 'The qualifier is needed since the existence and uniqueness of solutions is not guaranteed.  For more, see (Koperski forthcoming).'
               },
               {
                  active: false,
                  note: 'Methodological naturalism is the prescription that explanations in science can only refer to naturalistic entities and processes.  Metaphysical naturalism, in contrast, is the ontological claim that only naturalistic entities and processes exist.  A theist must reject metaphysical naturalism but might still believe that science is best conducted by way of methodological naturalism.'
               },
               {
                  active: false,
                  note: 'This merely assumes, again, the Humean view that miracles entail a violation of nature'
               }
            ]
         });
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
