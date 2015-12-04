(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleController', ArticleController);

   /** @ngInject */
   function ArticleController($state, $stateParams, articleRepository, $log, $document, $scope, $timeout, $http, $q, _, cslBuilder) {
      var vm = this;

      vm.activeTab = 'toc';

      // HACK: calculate scroll offset based on rem value and header-height
      var rem = 16;
      var headerHeight = 4*rem;
      vm.scrollOffset = headerHeight + 1*rem;

      vm.article = {};
      vm.toc = [];
      vm.citations = [];
      vm.bibliography = [];

      vm.scrollTo = scrollTo;
      vm.scrollToTop = scrollToTop;
      vm.activateNote = activateNote;
      vm.goBack = goBack;

      activate();

      function activate() {
         // vm.article = articleRepository.get({ id: $stateParams.id }, function () {
         //    initScroll();
         // });

         var unregisterFootnoteClickListener = $scope.$on('click:footnote', function (evt, data) {
            $scope.$apply(function () {
               activateNote(data.note, data.$event);
            });
         });

         $scope.$on('$destroy', unregisterFootnoteClickListener);

         var unregisterCitationClickListener = $scope.$on('click:citation', function (evt, data) {
            $scope.$apply(function () {
               activateCitation(data.citation, data.$event);
            });
         });

         $scope.$on('$destroy', unregisterCitationClickListener);


         // HACK: static content for development purposes
         var articleP = $http.get('app/reader/article/article.json').then(_.property('data'));

         articleP.then(function (article) {
            vm.article = article;
            initScroll();
         });


         // asynchronously load bibliographic data
         var citeprocP = articleP.then(function (article) {
            var bibliography = _.indexBy(article.bibliography, 'id');
            return cslBuilder.getEngine(bibliography, 'mla');
         });

         $q
            .all({
               article: articleP,
               citeproc: citeprocP
            })
            .then(function (data) {
               makeBibliography(data.article, data.citeproc);
            });
      }

      /**
       * Pull citations and bibliography from the article and render them into HTML for display
       *
       * @param {Article} article
       * @param {CSL.Engine} citeproc
       */
      function makeBibliography(article, citeproc) {
         var refIds = _.chain(article.citations)
            .pluck('citationItems')
            .flatten()
            .pluck('id')
            .unique()
            .value();

         citeproc.updateItems(refIds);

         vm.citations = article.citations.map(function (citation) {
            var citeData = citeproc.appendCitationCluster(citation, true);
            return {
               id: citation.id,
               text: citeData[0][1]
            };
         });

         var biblInfo = citeproc.makeBibliography();
         // An array of HTML strings, each of which is a formatted bibliographic item
         vm.bibliography = biblInfo[1];
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
         try {
            if (animated) {
               $document.duScrollToElementAnimated(target, vm.scrollOffset);
            } else {
               $document.duScrollToElement(target, vm.scrollOffset);
            }
         } catch (e) {
            $log.warn('unable to scroll to element by id', id);
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

      function goBack() {
         $state.go('sda.reader');
      }

      function activateNote(note, $event) {
         vm.article.footnotes.forEach(function (note) {
            note.active = false;
         });

         scrollTo(note.backlinkId, true, $event)

         vm.activeTab = 'footnotes';
         note.active = true;
      }
   }

})();
