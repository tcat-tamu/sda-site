(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleController', ArticleController);

   /** @ngInject */
   function ArticleController($state, $stateParams, articleRepository, $log, $window, $document, $scope, $timeout, $http, $q, _, cslBuilder) {
      var vm = this;

      vm.activeTab = null;

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
      vm.goToLink = goToLink;

      activate();

      function activate() {
         vm.article = articleRepository.get({ id: $stateParams.id }, function () {
            vm.article.links.forEach(function (link) {
               link.icon = getIcon(link.type);
            });

            var bibliography = _.indexBy(vm.article.bibliography, 'id');
            cslBuilder.getEngine(bibliography, 'mla').then(function (citeproc) {
               makeBibliography(vm.article, citeproc);
            });

            initScroll();
         });

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
               } else if ($stateParams.scrollTo.match(/cite/)) {
                  var citation = _.findWhere(vm.citations, {backlinkId: $stateParams.scrollTo});
                  if (citation) {
                     activateCitation(citation);
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

      function goToLink(link, $event) {
         if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
         }

         var state = getState(link.type);
         if (state) {
            $state.go(state, { id: link.id });
         } else {
            $window.location = link.uri;
         }
      }

      function activateNote(note, $event) {
         vm.article.footnotes.forEach(function (note) {
            note.active = false;
         });

         note.active = true;
         vm.activeTab = 'footnotes';

         scrollTo(note.backlinkId, true, $event)
      }

      function activateCitation(citation, $event) {
         vm.activeTab = 'bibliography';
         scrollTo(citation.backlinkId, true, $event);
      }

      /**
       * Get the appropriate (font-awesome) icon for a given link type
       *
       * @param {string} type
       * @return {string}
       */
      function getIcon(type) {
         switch (type) {
            case 'article':
               return 'file-text-o';
            case 'book':
               return 'book';
            case 'video':
               return 'film';
            case 'audio':
               return 'volume-up';
            default:
               return 'link';
         }
      }

      /**
       * Get the appropriate app state for a given link type
       *
       * @param {string} type
       * @return {string}
       */
      function getState(type) {
         switch (type) {
            case 'article':
               return 'sda.reader-article';
            // case 'book':
            //    return 'sda.library-book';
            case 'video':
               return 'sda.media-item';
            case 'audio':
               return 'sda.media-item';
            default:
               return null;
         }
      }
   }

})();
