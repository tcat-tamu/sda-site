(function () {
  'use strict';

  angular
    .module('sdaReader')
    .controller('ArticleController', ArticleController);

  var TAB_CONTENTS = 0;
  var TAB_LINKS = 1;
  var TAB_FOOTNOTES = 2;
  var TAB_BIBLIOGRAPHY = 3;

  /** @ngInject */
  function ArticleController($state, $stateParams, article, references, articlesRepo, $log, $window, $scope, $timeout, _, refsRenderer) {
    var vm = this;

    vm.article = article;

    vm.activeTab = TAB_CONTENTS;

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
    vm.goBack = function () {
      $state.go('sda.reader.main.preview', {
        id: vm.article.id
      });
    }

    activate();

    function activate() {
      var renderedP = references.$promise.then(function () {
        return refsRenderer.render('chicago', references);
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

      vm.orderedFootnotes = getOrderedFootnotes(vm.article);
      initScroll();
    }

    /**
     * Callback for when the article has been loaded.
     *
     * @param {Article} article
     */
    function getOrderedFootnotes(article) {
      var orderedFootnotes = [];
      angular.element(article.body)
        .find('sup.footnote[data-footnote]')
        .each(function (i, el) {
          var footnoteId = angular.element(el).data('footnote');
          var footnote = article.footnotes[footnoteId];

          if (footnote) {
            // sanity check
            if (orderedFootnotes.indexOf(footnote) >= 0) {
              $log.error('duplicate reference to footnote ' + footnoteId);
            } else {
              orderedFootnotes.push(footnote);
            }
          }
        });

      return orderedFootnotes;
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
          var note = _.findWhere(vm.article.footnotes, {
            backlinkId: $stateParams.scrollTo
          });
          if (note) {
            activateNote(note);
            return;
          }

          // fall back to finding citation
          var citation = _.findWhere(vm.citations, {
            backlinkId: $stateParams.scrollTo
          });
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

    function activateNote(note, $event) {
      angular.forEach(vm.article.footnotes, function (note) {
        note.active = false;
      });

      note.active = true;
      vm.activeTab = TAB_FOOTNOTES;

      scrollTo(note.backlinkId, true, $event)
    }

    function activateCitation(citation, $event) {
      vm.activeTab = TAB_BIBLIOGRAPHY;
      scrollTo(citation.id, true, $event);
    }
  }

})();
