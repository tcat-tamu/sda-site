(function () {
   'use strict';

   angular
      .module('sda.reader')
      .directive('articleParser', articleParser);

   /** @ngInject */
   function articleParser(MathJax, _, tocGenerator) {
      var directive = {
         restrict: 'E',
         scope: {
            body: '=',
            footnotes: '=',
            setToc: '&generateToc'
         },
         link: linkFunc
      };

      return directive;

      function linkFunc($scope, el) {
         $scope.$watchGroup(['body', 'footnotes'], function (newValues, oldValues) {
            var body = newValues[0];
            var oldBody = oldValues[0];
            var footnotes = newValues[1];

            if (body && (body !== oldBody || !oldBody)) {
               // render HTML content
               el.html(body || '');

               // typeset math notation
               MathJax.Hub.Queue(['Typeset', MathJax.Hub, el.get(0)]);

               // parse table of contents
               var toc = parseToc(el);
               $scope.setToc({toc: toc});
            }

            if (footnotes) {
               // parse footnotes
               parseFootnotes(el, footnotes, onFootnoteClicked);
            }
         });

         /**
          * propagate footnote 'click' events to scope
          *
          * @param {string} id ID of the footnote that was clicked
          * @param {event} $event originating click event
          */
         function onFootnoteClicked(id, $event) {
            $scope.$emit('click:footnote', { id: id, $event: $event });
         }
      }

      /**
       * Add backrefs to footnotes and trigger click events
       *
       * @param {Element} domRoot
       * @param {Footnote[]} footnotes
       * @param {function(id:string, $event:event)} clickHandler
       */
      function parseFootnotes(domRoot, footnotes, clickHandler) {
         domRoot.find('sup.footnote-anchor').each(function (i, a) {
            var anchor = angular.element(a);
            var target = _.findWhere(footnotes, { id: anchor.data('href').replace(/^#/, '') });

            var backlinkId = 'footnote' + i;


            if (target) {
               target.backlinkId = backlinkId;
            }

            anchor
               .attr('id', backlinkId)
               .on('click', _.partial(clickHandler, this.id))
               .text(i+1);
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
                  .andSelf()
                  .wrapAll('<section id="' + curr.id + '"/>');
               wrapParagraphs(curr.children);
            }
         }
      }
   }

})();
