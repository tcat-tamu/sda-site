(function () {
  'use strict';

  angular
    .module('sdaReader')
    .directive('articleParser', articleParser);

  /** @ngInject */
  function articleParser(MathJax, _, tocGenerator) {
    var directive = {
      restrict: 'E',
      scope: {
        body: '=',
        footnotes: '=',
        citations: '=',
        setToc: '&generateToc'
      },
      link: linkFunc
    };

    return directive;

    function linkFunc($scope, el) {
      $scope.$watch('body', function (body) {
        if (!body) {
          return;
        }

        // render HTML content
        el.html(body || '');

        // typeset math notation
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, el.get(0)]);

        // parse table of contents
        var toc = parseToc(el);
        if ($scope.setToc) {
          $scope.setToc({toc: toc});
        }

        parseFootnotes(el, $scope.footnotes, onFootnoteClicked);
      });

      $scope.$watch('footnotes', function (footnotes) {
        parseFootnotes(el, footnotes, onFootnoteClicked);
      });

      $scope.$watch('citations', function (citations) {
        parseCitations(el, citations, onCitationClicked);
      });

      /**
       * propagate footnote 'click' events to scope
       *
       * @param {Footnote} note The footnote whose anchor was clicked
       * @param {event} $event originating click event
       */
      function onFootnoteClicked(note, $event) {
        $scope.$emit('click:footnote', { id: note.id, note: note, $event: $event });
      }

      /**
       * propagate citation 'click' events to scope
       *
       * @param {Citation} citation The citation whose anchor was clicked
       * @param {event} $event originating click event
       */
      function onCitationClicked(citation, $event) {
        $scope.$emit('click:citation', { id: citation.id, citation: citation, $event: $event });
      }
    }

    /**
     * footnote numbering and click handling
     *
     * @param {Element} domRoot
     * @param {Footnote[]} footnotes
     * @param {function(id:string, $event:event)} clickHandler
     */
    function parseFootnotes(domRoot, footnotes, clickHandler) {
      if (!footnotes) {
        return;
      }

      domRoot.find('sup.footnote[data-footnote]').each(function (i, el) {
        var anchor = angular.element(el);
        var footnoteId = anchor.data('footnote')
        var target = footnotes[footnoteId];

        anchor
          .on('click', _.partial(clickHandler, target))
          .text(i+1);
      });
    }

    /**
     * Add backrefs to citations and trigger click events
     *
     * @param {Element} domRoot
     * @param {CitationView[]} citations
     * @param {function(id:string, $event:event)} clickHandler
     */
    function parseCitations(domRoot, citations, clickHandler) {
      if (!citations) {
        return;
      }

      domRoot.find('cite[id]').each(function (i, a) {
        var anchor = angular.element(a);
        var citeId = anchor.attr('id');
        var target = citations[citeId];

        if (target) {
          anchor
            .on('click', _.partial(clickHandler, target))
            .html(target);
        }
      });
    }

    /**
     * Build a hierarchy of menu nodes from a flat list of heading DOM elements beneath the
     * provided root DOM element
     *
     * @param {Element} domRoot Root DOM element to search for headings
     * @return {TocNode}
     */
    function parseToc(domRoot) {
      var root = tocGenerator.parse(domRoot);

      // modify DOM
      wrapParagraphs(root.children);

      return root;

      function wrapParagraphs(nodes) {
        for (var i = 0; i < nodes.length; i++) {
          var curr = nodes[i];
          var next = (i < nodes.length) ? nodes[i+1] : null;

          angular.element(curr.el)
            .nextUntil(next ? next.el : null)
            .addBack()
            .wrapAll('<section id="' + curr.id + '"/>');
          wrapParagraphs(curr.children);
        }
      }
    }
  }

})();
