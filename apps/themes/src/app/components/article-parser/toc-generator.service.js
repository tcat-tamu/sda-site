(function () {
   'use strict';

   angular
      .module('sdaReader')
      .factory('tocGenerator', tocGeneratorFactory);

   function tocGeneratorFactory() {
      var API = {};

      API.parse = parseElement;

      return API;

      /**
       * @typedef {{id:string, el:Element, parent:TocNode=, children:TocNode[], level:integer, text:string}} TocNode
       */

      /**
       * Traverses DOM tree looking for header tags and constructs a hierarchical table of contents.
       *
       * @param  {Element|selector} domRoot
       * @return {TocNode} composite TOC structure; root node is container without element or text
       */
      function parseElement(domRoot) {
         var root = {
            parent: null,
            children: [],
            level: 0
         };

         // find all headings
         var headings = angular.element(domRoot).find('h1,h2,h3,h4,h5,h6');

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

         return root;
      }
   }


})();
