(function () {
   'use strict';

   angular
      .module('sda.reader')
      .controller('ArticleController', ArticleController);

   /** @ngInject */
   function ArticleController($state, $stateParams, articleRepo, $log, $window, $scope, $timeout, _, refsRenderer, refsRepoFactory) {
      var articleId = $stateParams.id;
      var refsEndpoint = articleRepo.getReferencesEndpoint(articleId);
      var refsRepo = refsRepoFactory.getRepo(refsEndpoint);

      var vm = this;

      vm.activeTab = null;

      vm.article = null;
      vm.links = [];
      vm.orderedFootnotes = [];
      vm.articleType = null;

      vm.toc = [];
      vm.citations = [];
      vm.bibliography = [];

      vm.titleCase = _.startCase;
      vm.scrollTo = scrollTo;
      vm.scrollToTop = scrollToTop;
      vm.activateNote = activateNote;
      vm.goToLink = goToLink;
      vm.goBack = function () { $state.go('sda.reader.main.preview', { id: vm.article.id }); }

      activate();

      function activate() {
         vm.article = articleRepo.get(articleId);
         vm.article.$promise.then(onArticleLoaded);

         var references = refsRepo.get();
         var renderedP = references.$promise.then(function () {
            return refsRenderer.render('modern-language-association', references);
         });

         renderedP.then(function (rendered) {
            vm.citations = rendered.citations;
            vm.bibliography = rendered.bibliography;
         });

         $scope.$on('click:footnote', function (evt, data) {
            $scope.$apply(function () {
               activateNote(data.note, data.$event);
            });
         });

         $scope.$on('click:citation', function (evt, data) {
            $scope.$apply(function () {
               activateCitation(data.citation, data.$event);
            });
         });
      }

      /**
       * Callback for when the article has been loaded.
       *
       * @param {Article} article
       */
      function onArticleLoaded() {
         if (vm.article.links) {
            vm.article.links.forEach(function (link) {
               link.icon = getIcon(link.type);
            });
         }

         vm.orderedFootnotes = [];
         angular.element(vm.article.body)
            .find('sup.footnote[data-footnote]')
            .each(function (i, el) {
               var footnoteId = angular.element(el).data('footnote');
               var footnote = vm.article.footnotes[footnoteId];

               if (footnote) {
                  // sanity check
                  if (vm.orderedFootnotes.indexOf(footnote) >= 0) {
                     $log.error('duplicate reference to footnote ' + footnoteId);
                  } else {
                     vm.orderedFootnotes.push(footnote);
                  }
               }
            });

         initScroll();
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
               // try to find footnote first
               var note = _.findWhere(vm.article.footnotes, {backlinkId: $stateParams.scrollTo});
               if (note) {
                  activateNote(note);
                  return;
               }

               // fall back to finding citation
               var citation = _.findWhere(vm.citations, {backlinkId: $stateParams.scrollTo});
               if (citation) {
                  activateCitation(citation);
                  return;
               }

               // if all else fails, just scroll to arbitrary anchor
               scrollTo($stateParams.scrollTo, false);
            });
         }
      }

      function scrollTo(id, animated, $event) {
         if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
         }

         var container = angular.element('#article-content');
         var target = angular.element('#' + id);
         try {
            if (animated) {
               container.duScrollToElementAnimated(target);
            } else {
               container.duScrollToElement(target);
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

         var container = angular.element('#article-content');
         if (animated) {
            container.duScrollTopAnimated(0);
         } else {
            container.duScrollTop(0);
         }
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
         angular.forEach(vm.article.footnotes, function (note) {
            note.active = false;
         });

         note.active = true;
         vm.activeTab = 'footnotes';

         scrollTo(note.backlinkId, true, $event)
      }

      function activateCitation(citation, $event) {
         vm.activeTab = 'bibliography';
         scrollTo(citation.id, true, $event);
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
               return 'sda.reader.article';
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
