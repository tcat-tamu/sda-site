define(function (require) {

   var $ = require('jquery');
   var _ = require('underscore');

   /**
    * Menu node composite data structure
    *
    * @param {Node|null} parent
    */
   function Node(parent) {
      this.parent = parent;
      this.children = [];

      if (this.parent) {
         this.parent.children.push(this);
      }
   }


   /**
    * Build a hierarchy of menu nodes given a flat list of heading DOM elements.
    * The returned root element is not meant to be rendered.
    *
    * @param {Element[]} headings h1-h6 DOM elements
    * @return {Node}
    */
   function buildTree(headings) {
      var root = new Node(null);
      root.level = 0;

      var node = root;
      for (var i = 0; i < headings.length; i++) {
         var heading = headings[i];
         var level = parseInt(heading.tagName.substr(1));

         // find parent whose level is just above this heading's level (e.g. set scope to nearest h2 if this is h3)
         while (level <= node.level && node.parent) {
            node = node.parent;
         }

         // create node and set as current scope
         node = new Node(node);
         node.level = level;
         node.el = heading;
         node.text = $(heading).text();
         node.id = 'x' + i + '-' + node.text.toLowerCase().replace(/[^\w]/g, '-');

      }

      return root;
   }


   /**
    * Generate a list of trees that represents the semantic table of contents produced by all h1-h6 headings beneath the supplied DOM element.
    *
    * @param {Element|string|jQuery} domRoot
    * @return {Node[]}
    */
   function generate(domRoot) {
      // find all headings
      var headings = $(domRoot).find('h1,h2,h3,h4,h5,h6');

      // build hierarchy
      var root = buildTree(headings);

      // cut off the root element
      return root.children;
   }


   /**
    * Builds menu list item DOM element that links to a header
    *
    * @param {Node} node
    * @return {Element} rendered list item with sub-menus as necessary
    */
   function renderMenuItem(node, options) {
      var opts = _.defaults(_.clone(options) || {}, {
         setIds: true
      });

      // create menu item DOM element
      var item = $('<li>');

      // link to heading element
      $('<a>', {
         href: '#' + node.id,
         text: node.text
      }).appendTo(item);

      if (opts.setIds && node.el) {
         $(node.el).attr('id', node.id);
      }

      // recursively render children if any
      if (node.children && node.children.length > 0) {
         var submenu = renderMenu(node.children, opts);
         item.append(submenu);
      }

      return item.get(0);
   }


   /**
    * Builds a table of contents menu list DOM element from a list of menu nodes
    *
    * @param {Node[]} nodes
    * @return {Element} rendered list
    */
   function renderMenu(nodes, options) {
      var opts = _.defaults(_.clone(options) || {}, {
         setIds: true
      });

      // create menu DOM element
      var menu = $('<ol>');

      // recursively render nodes in menu
      nodes.forEach(function (child) {
         var item = renderMenuItem(child, opts);
         menu.append(item);
      });

      return menu.get(0);
   }


   // expose public API
   return {
      generate: generate,
      render: renderMenu
   };
});
