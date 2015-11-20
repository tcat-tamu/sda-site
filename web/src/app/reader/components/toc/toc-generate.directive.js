(function () {
   'use strict';

   angular
      .module('sda.reader')
      .directive('tocGenerate', tocGenerate);

   /** @ngInject */
   function tocGenerate() {
      var directive = {
         restrict: 'A',
         scope: {
            setToc: '&tocGenerate',
            ngModel: '='
         },
         link: linkFunc
      };

      return directive;

      function linkFunc(scope, el) {
         scope.$watch('ngModel', function (value) {
            el.html(value || '');
            var toc = parseToc(el);
            scope.setToc({toc: toc});
         });
      }

      /**
       * Build a hierarchy of menu nodes given a flat list of heading DOM elements.
       * The returned root element is not meant to be rendered.
       *
       * @param {Element} domRoot Root DOM element to search for headings
       * @return {object}
       */
      function parseToc(domRoot) {
         var root = {
            parent: null,
            children: [],
            level: 0
         };

         // find all headings
         var headings = domRoot.find('h1,h2,h3,h4,h5,h6');

         // build hierarchy
         var node = root;
         for (var i = 0; i < headings.length; i++) {
            var heading = headings[i];
            var level = parseInt(heading.tagName.substr(1));

            // find parent whose level is just above this heading's level (e.g. set scope to nearest h2 if this is h3)
            while (level <= node.level && node.parent) {
               node = node.parent;
            }

            // create child node
            var text = heading.innerHTML.trim().replace(/<[^>]+>/g, '');
            var id = 'x' + i + '-' + text.toLowerCase().replace(/[^\w]+/g, '-');
            var child = {
               parent: node,
               level: level,
               el: heading,
               text: text,
               id: id,
               children: []
            };
            node.children.push(child);

            // set as current scope;
            node = child;
         }

         // modify DOM
         wrapParagraphs(root.children);

         return root;

         function wrapParagraphs(nodes) {
            for (var i = 0; i < nodes.length; i++) {
               var curr = nodes[i];
               var next = (i < nodes.length) ? nodes[i+1] : null;

               angular.element(curr.el).nextUntil(next ? next.el : null).andSelf().wrapAll('<section id="' + curr.id + '" />');
               wrapParagraphs(curr.children);
            }
         }
      }
   }

})();
