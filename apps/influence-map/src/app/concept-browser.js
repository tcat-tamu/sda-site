/*eslint-env amd,browser,node*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'event-dispatcher', 'd3-force-cylindrical'], factory);
  } else if (typeof module === 'object' && module.exports) {
    require('d3-force-cylindrical');
    module.exports = factory(require('d3'), require('event-dispatcher'));
  } else {
    root.ConceptBrowser = factory(root.d3, root.EventDispatcher);
  }
})(this, function (d3, EventDispatcher) {
  'use strict';

  /** @type {integer} */
  var NODE_MIN_SIZE = 5;

  /** @type {integer} */
  var NODE_MAX_SIZE = 13;

  /** @type {object.<string,functin>} */
  var GRAPH_LAYOUT_CTORS = {
    planar: d3.layout.force,
    cylindrical: d3.layout.force.cylindrical
  };

  /** @type {string} */
  var TIP_CSS_CLASS = 'd3-tip';

  /** @type {object.<string,integer>} */
  var TIP_POSITION_MARGIN = {
    left: 200,
    right: 200,
    top: 100,
    bottom: 100
  };

  if (!d3.tip) {
    // eslint-disable-next-line no-console
    console.warn('d3.tip is not available; tooltips will not display properly.');
  }

  /**
   * SDA Concept Browser Visualization
   *
   * @param  {Element} rootEl
   * @param  {integer} width
   * @param  {integer} height
   * @param  {string} [layout=planar] - one of: (planar, cylindrical)
   */
  function ConceptBrowser(rootEl, layout, options) {
    layout = layout || 'planar';
    options = options || {};

    var events = EventDispatcher();

    if (options.debug) {
      events.all(function (eventName, context) {
        // eslint-disable-next-line no-console
        console.log(eventName, context.node ? context.node.id : context);
      });
    }

    /**
     * visualization width in pixels
     *
     * @type {integer}
     */
    var width;

    /**
     * visualization height in pixels
     *
     * @type {integer}
     */
    var height;

    /**
     * Nodes in the graph
     *
     * @type {Node[]}
     */
    var nodes = [];

    /**
     * Edges connecting nodes in the graph
     *
     * @type {Node[]}
     */
    var edges = [];

    /**
     * Collection of nodes that are in the "highlighted" state
     *
     * @type {Node[]}
     */
    var highlighted = [];

    /**
     * The currently focused node (if there is one)
     *
     * @type {?Node}
     */
    var focused = null;

    /**
     * Collection of nodes that are in the "selected" state
     *
     * @type {Node[]}
     */
    var selected = [];

    /**
     * The currently activated node (if there is one)
     *
     * @type {?Node}
     */
    var activated = null;

    /**
     * @type {d3.selection}
     */
    var svg;

    /**
     * @type {d3.selection}
     */
    var nodeLayer;

    /**
     * @type {d3.selection}
     */
    var edgeLayer;

    /**
     * @type {d3.selection}
     */
    var progressBar;

    /**
     * @type {d3.scale}
     */
    var progressScale;

    /**
     * @type {d3.scale}
     */
    var nodeRadiusScale;

    /**
     * @type {d3.scale}
     */
    var centralityMetricScale;

    /**
     * @type {d3.layout.force}
     */
    var graph;

    /**
     * function used in a selection.call() method for drawing edge paths.
     * by default, it draws a straight line between the edge source and target nodes
     *
     * @type {function}
     */
    var drawEdge = function (selection) {
      selection.attr('d', function (edge) {
        var x1 = edge.source.x;
        var y1 = edge.source.y;
        var x2 = edge.target.x;
        var y2 = edge.target.y;

        return 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
      });
    }

    /**
     * @type {?d3.tip}
     */
    var tooltip = null;

    /**
     * @type {boolean}
     */
    var isInitialized = false;

    /**
     * Given a selected node, determines what other nodes should be highlighted.
     * @type {function}
     */
    var selectMode = function (node) {
      if (!node) {
        return [];
      }

      var adjacent = node.outEdges.forEach(function (edge) {
        return edge.target;
      });

      var incident = node.inEdges.forEach(function (edge) {
        return edge.source;
      });

      return [node].concat(adjacent, incident);
    };

    /**
     * Given a node, what is its size metric?
     * @type {function}
     */
    var centralityMetric = function () {
      return 1;
    };

    /**
     * A predicate to determine whether a given edge should display
     * @type {function}
     */
    var edgeFilter = function () {
      return true;
    };

    ////////////////////////////////////////////////////////////

    // expose public methods
    var API = {};
    API.size = setSize;
    API.nodeCentralityMetric = setNodeCentralityMetric;
    API.selectMode = setSelectMode;
    API.data = setData;
    API.highlight = setHighlighted;
    API.activate = setActivated;
    API.edgeFilter = setEdgeFilter;
    API.updateGraphSelections = applyStyleClasses;
    API.refresh = refresh;
    API.on = events.on;
    return API;

    ////////////////////////////////////////////////////////////

    /**
     * Sets graph dimensions. refresh() must be called in order for changes to take effect
     *
     * @param {integer[]} dims - dimensions (width, height) of new viewing area
     */
    function setSize(dims) {
      width = dims[0];
      height = dims[1];

      if (isInitialized) {
        svg.attr('width', width).attr('height', height);
        progressScale.range([0, width]);
        graph.size([width, height]);
      }

      return API;
    }

    /**
     * Sets a node size metric function
     *
     * @param {function} nodeCentralityMetric
     */
    function setNodeCentralityMetric(nodeCentralityMetric) {
      centralityMetric = nodeCentralityMetric;

      if (isInitialized) {
        var centralityExtent = d3.extent(nodes, centralityMetric);
        centralityMetricScale.domain(centralityExtent[0] === centralityExtent[1] ? [centralityExtent[0] - 1, centralityExtent[1] + 1] : centralityExtent);
      }

      return API;
    }

    /**
     * Sets a node selection mode function
     *
     * @param {function} _selectMode
     */
    function setSelectMode(_selectMode) {
      selectMode = _selectMode;

      return API;
    }

    /**
     * Sets graph data. refresh() must be called in order for changes to take effect
     *
     * @param {Node[]} _nodes
     * @param {Edge[]} _edges
     */
    function setData(_nodes, _edges) {
      nodes = _nodes;
      edges = _edges;

      // randomize node positions if not already set
      nodes.forEach(function (node) {
        node.x = (node.x || Math.random()) * width;
        node.y = (node.y || Math.random()) * height;
      });

      return API;
    }

    /**
     * Sets the set of currently highlighted nodes
     *
     * @param {Node|Node[]} nodes
     */
    function setHighlighted(highlightedNodes) {
      if (!(highlightedNodes instanceof Array)) {
        highlightedNodes = [highlightedNodes];
      }

      // make sure every node is present in the graph
      var allNodesInGraph = highlightedNodes.every(function (node) {
        return nodes.indexOf(node) >= 0;
      });

      if (!allNodesInGraph) {
        throw new Error('some node(s) to be highlighted are not members of the graph');
      }

      unhighlightAll();
      highlight(highlightedNodes);

      return API;
    }

    /**
     * Sets the currently active node
     *
     * @param {Node} node
     */
    function setActivated(node) {
      if (node && nodes.indexOf(node) < 0) {
        throw new Error('node to be activated is not a member of the graph');
      }

      deactivate();

      if (node) {
        activate(node);

        // also select nodes
        deselectAll();
        select(node);
      }

      return API;
    }

    /**
     * Sets an edge predicate that determines whether an edge should be displayed
     *
     * @param {function} fn
     */
    function setEdgeFilter(fn) {
      edgeFilter = fn;

      return API;
    }

    /**
     * Update node and edge bindings for display and run force-directed graph simulation
     *
     * @param {object} data
     */
    function refresh() {
      // ensure visualization is initialized
      initialize();

      // begin force-directed simulation
      graph
        .nodes(nodes)
        .links(edges)
        .start();

      bindNodes();
      bindEdges();

      return API;
    }

    ////////////////////////////////////////////////////////////

    function initialize() {
      if (!width || !height) {
        throw new Error('No width/height set. Use size([width, height]) to set size before initializing');
      }

      if (!nodes || !edges) {
        throw new Error('No nodes/edges set. Use data(nodes, edges) to set them before initializing');
      }

      if (isInitialized) {
        return;
      }

      isInitialized = true;

      svg = d3.select(rootEl).append('svg')
        .attr('width', width)
        .attr('height', height);

      // extract edge types and create arrowhead styles for them
      var edgeTypes = edges.reduce(function (types, edge) {
        if (types.indexOf(edge.relation) < 0) {
          types.push(edge.relation);
        }
        return types;
      }, []);

      defineArrowheads(svg, edgeTypes, ['', 'activated', 'selected', 'focused']);

      var baseGroup = svg.append('g').attr('class', 'concept-browser');
      edgeLayer = baseGroup.append('g').attr('class', 'edges');
      nodeLayer = baseGroup.append('g').attr('class', 'nodes');

      progressBar = baseGroup.append('rect').attr('class', 'progress')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 2);

      progressScale = d3.scale.linear()
        .domain([Math.log(0.1), Math.log(0.005)])
        .range([0, width]);

      var centralityExtent = d3.extent(nodes, centralityMetric);
      centralityMetricScale = d3.scale.linear()
        .domain(centralityExtent[0] === centralityExtent[1] ? [centralityExtent[0] - 1, centralityExtent[1] + 1] : centralityExtent)
        .range([0, 1]);

      nodeRadiusScale = function (x) {
        return NODE_MIN_SIZE + (NODE_MAX_SIZE - NODE_MIN_SIZE) * centralityMetricScale(x);
      }

      graph = GRAPH_LAYOUT_CTORS[layout || 'planar']()
        .size([width, height])
        .on('tick', tick);
      configureGraph(graph);

      if (graph.edgePath) {
        drawEdge = graph.edgePath()
          .x1(function (edge) { return edge.source.x; })
          .y1(function (edge) { return edge.source.y; })
          .x2(function (edge) { return edge.target.x; })
          .y2(function (edge) { return edge.target.y; });
      }

      if (d3.tip) {
        tooltip = d3.tip()
            .attr('class', TIP_CSS_CLASS)
            .direction(tooltipDirection)
            .offset(tooltipOffset)
            .html(function (node) { return node.label; });

        events.on('focus', function (evt) { showTooltip(evt.node); });
        events.on('blur', function (evt) { hideTooltip(evt.node); });
      }

      var updateGraphSelections = debounce(applyStyleClasses, 100, true, true);

      events.on('highlight', updateGraphSelections);
      events.on('unhighlight', updateGraphSelections);
      events.on('focus', updateGraphSelections);
      events.on('blur', updateGraphSelections);
      events.on('select', updateGraphSelections);
      events.on('deselect', updateGraphSelections);
      events.on('activate', updateGraphSelections);
      events.on('deactivate', updateGraphSelections);
    }

    /**
     * Sets configuration values on a D3 graph instance
     *
     * @param  {d3.svg.graph} graph
     */
    function configureGraph(graph) {
      graph
        .gravity(0.1)
        // .linkDistance(50)
        // .chargeDistance(width * 0.25)
        .linkDistance(50)
        .linkStrength(function (edge) {
          // influential nodes pull their supporters closer
          var sz = centralityMetric(edge.source);
          return centralityMetricScale(sz)
          // var targetInfluence = edge.target.stats.in_degree / 10;
          // return 1 - 1/(1 + targetInfluence);
        })
        .charge(function (node) {
          // HACK experiment with variably-charged nodes
          var chargeRange = [-50, -300];
          var influenceRange = [0, 1];
          var sz = centralityMetric(node);

          return chargeRange[0] + (chargeRange[1] - chargeRange[0])/(influenceRange[1] - influenceRange[0]) * (centralityMetricScale(sz) - influenceRange[0]);
        })
        .friction(.9);
        // .theta(0.08);
    }

    /**
     * Update node positions with each tick of a graph's physics simulation
     *
     * @param {object} evt
     */
    function tick(evt) {
      updatePositions();

      if (evt.alpha > 0.0051) {
        progressBar.attr('width', progressScale(Math.log(evt.alpha)));
        // bail early; do not render nodes
        if (Math.random() < 0.9) return;
      } else {
        progressBar.attr('width', 0);
      }

      nodeLayer.selectAll('.node').transition().duration(500)
        .attr('transform', function (node) {
          return 'translate(' + node.x + ',' + node.y + ')';
        });

      edgeLayer.selectAll('.edge').transition().duration(500)
        .call(drawEdge);
    }

    /**
     * Update node bindings on the visualization
     *
     * @param  {Node[]} nodes
     */
    function bindNodes() {
      if (!nodes || nodes.length === 0) {
        throw new Error('no nodes provided');
      }

      // var nodeMetricExtent = d3.extent(nodes, function (node) {
      //   return (node.metadata && node.metadata.pagerank) || 1;
      // });

      // nodeRadiusScale.domain(nodeMetricExtent);

      var nodeSelect = nodeLayer.selectAll('.node')
        .data(nodes, function (node) {
          return node.id;
        });

      var nodeEnter = nodeSelect.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function (node) {
          return 'translate(' + node.x + ',' + node.y + ')';
        })
        .on('mouseover', focus)
        .on('mouseout', blur)
        .on('dblclick', activate)
        .on('click', function (node) {
          if (d3.event.ctrlKey || d3.event.metaKey || d3.event.shiftKey) {
            if (selected.indexOf(node) < 0) {
              select(node);
            } else {
              deselect(node);
            }
          } else {
            deselectAll();
            select(node);
          }
        });

      nodeEnter.append('circle');

      nodeSelect.select('circle')
        .attr('r', function (node) {
          var sz = centralityMetric(node);
          return nodeRadiusScale(sz);
        });

      nodeSelect.exit().remove();

      if (tooltip) {
        nodeLayer.call(tooltip);
      }
    }

    /**
     * Update edge bindings on the visualization
     *
     * @param  {Edge[]} edges
     */
    function bindEdges() {
      if (!edges || edges.length === 0) {
        throw new Error('no edges provided');
      }

      var edgeSelect = edgeLayer.selectAll('.edge')
        .data(edges, function (edge) {
          return edge.source.id + ',' + edge.target.id;
        });

      edgeSelect.enter().append('path')
        .attr('class', function (edge) {
          return 'edge ' + edge.relation;
        })
        .attr('marker-end', function (edge) {
          return 'url(#arrowhead-' + edge.relation + ')';
        })
        // .style('stroke-width', function (edge) {
        //   var multiplicity = (edge.metadata && edge.metadata.multiplicity) || 1;
        //   return multiplicity + 'pt';
        // })
        .call(drawEdge);

      edgeSelect.exit().remove();
    }

    /**
     * Adds the given node or nodes to the set of highlighted nodes
     *
     * @param {Node|Node[]} ns
     */
    function highlight(ns) {
      if (!(ns instanceof Array)) {
        ns = [ns];
      }

      ns.forEach(function (n) {
        if (highlighted.indexOf(n) < 0) {
          highlighted.push(n);
        }

        events.trigger('highlight', { node: n, selection: selected });
      });
    }

    /**
     * Unhighlights the given node, nodes, or all currently highlighted nodes
     * @param  {Node|Node[]} [ns]
     */
    function unhighlight(ns) {
      if (!ns) {
        return unhighlightAll();
      } else if (!(ns instanceof Array)) {
        ns = [ns];
      }

      ns.forEach(function (n) {
        var ix = highlighted.indexOf(n);
        if (ix >= 0) {
          highlighted.splice(ix, 1);
        }
      });
    }

    /**
     * Unhighlights all nodes
     */
    function unhighlightAll() {
      highlighted.forEach(function (node) {
        events.trigger('unhighlight', { node: node, selection: selected });
      });

      highlighted = [];
    }

    /**
     * Focuses the given node
     *
     * @param {Node} node
     */
    function focus(node) {
      // ensure that the currently selected node has already been blurred
      blur();

      focused = node;
      events.trigger('focus', { node: focused, selection: selected });
    }

    /**
     * Blurs the given node or the currently focused node.
     *
     * @param {Node} [node]
     */
    function blur(node) {
      node = node || focused;

      if (node) {
        if (focused === node) {
          focused = null;
        } else {
          throw new Error('tried to blur a node that was not focused');
        }

        events.trigger('blur', { node: node, selection: selected });
      }
    }

    /**
     * Activates the given node
     *
     * @param {Node} node
     */
    function activate(node) {
      // don't do anything if node is already active
      if (activated === node) {
        return;
      }

      // ensure that the active node has been deactivated
      deactivate()

      activated = node;
      events.trigger('activate', { node: activated, selection: selected });
    }

    /**
     * Deactivates the given node or the currently activated node.
     *
     * @param {Node} node
     */
    function deactivate(node) {
      node = node || activated;

      if (node) {
        if (activated === node) {
          activated = null;
        } else {
          throw new Error('tried to deactivate a node that was not activated');
        }

        events.trigger('deactivate', { node: node, selection: selected });
      }
    }

    /**
     * Adds the given node to the list of currently selected nodes
     *
     * @param {Node} node
     */
    function select(node) {
      if (!node) {
        throw new Error('no node provided');
      }

      if (selected.indexOf(node) < 0) {
        selected.push(node);
      } else {
        throw new Error('tried to select a node that is already selected');
      }

      events.trigger('select', { node: node, selection: selected });
    }

    /**
     * Removes the given node from the list of currently selected nodes
     *
     * @param {Node} node
     */
    function deselect(node) {
      if (!node) {
        throw new Error('no node provided to deselect');
      }

      var ix = selected.indexOf(node);
      if (ix < 0) {
        throw new Error('tried to deselect a node that was not selected');
      } else {
        selected.splice(ix, 1);
      }

      events.trigger('deselect', { node: node, selection: selected });
    }

    /**
     * Deselects all selected nodes
     */
    function deselectAll() {
      selected.forEach(function (node) {
        events.trigger('deselect', { node: node, selection: [] });
      });

      selected = [];
    }

    /**
     * Displays a tooltip with a label for the given node.
     *
     * @param {Node} node
     */
    function showTooltip(node) {
      if (tooltip) {
        tooltip.attr('class', TIP_CSS_CLASS)
          .show(node);
      }
    }

    /**
     * Hides the tooltip for the given node.
     *
     * @param {Node} node
     */
    function hideTooltip(node) {
      if (tooltip) {
        tooltip.attr('class', TIP_CSS_CLASS)
          .hide(node);
      }
    }

    /**
     * Marks selected nodes and edges as highlighted
     */
    function applyStyleClasses() {
      var activatedSet = [activated];


      var selectedSet = selected.slice();

      var focusedSet = selectMode(focused);

      // ego graphs of selected nodes get focused
      selected.forEach(function (p) {
        selectMode(p).forEach(function (q) {
          if (focusedSet.indexOf(q) < 0) {
            focusedSet.push(q);
          }
        });
      });

      // ego graphs of activated nodes get focused
      selectMode(activated).forEach(function (q) {
        if (focusedSet.indexOf(q) < 0) {
          focusedSet.push(q);
        }
      });

      var highlightedSet = highlighted.slice();

      nodeLayer.selectAll('.node')
        .classed('activated', function (node) {
          return activatedSet.indexOf(node) >= 0;
        })
        .classed('selected', function (node) {
          return selectedSet.indexOf(node) >= 0;
        })
        .classed('focused', function (node) {
          return focusedSet.indexOf(node) >= 0;
        })
        .classed('highlighted', function (node) {
          return highlightedSet.indexOf(node) >= 0;
        });

      edgeLayer.selectAll('.edge')
        .classed('activated', function (edge) {
          return activatedSet.indexOf(edge.source) >= 0 && activatedSet.indexOf(edge.target) >= 0;
        })
        .classed('selected', function (edge) {
          return selectedSet.indexOf(edge.source) >= 0 && selectedSet.indexOf(edge.target) >= 0;
        })
        .classed('focused', function (edge) {
          return focusedSet.indexOf(edge.source) >= 0 && focusedSet.indexOf(edge.target) >= 0;
        })
        .classed('hidden', function (edge) {
          return !edgeFilter(edge);
        })
        .attr('marker-end', function (edge) {
          var cls = '';

          if (activatedSet.indexOf(edge.source) >= 0 && activatedSet.indexOf(edge.target) >= 0) {
            cls = '-activated';
          } else if (selectedSet.indexOf(edge.source) >= 0 && selectedSet.indexOf(edge.target) >= 0) {
            cls = '-selected'
          } else if (focusedSet.indexOf(edge.source) >= 0 && focusedSet.indexOf(edge.target) >= 0) {
            cls = '-focused'
          }

          return 'url(#arrowhead-' + edge.relation + cls + ')';
        });
    }

    /**
     * Sets positions of each node to within the viewing area, wrapping left and right sides
     */
    function updatePositions() {
      nodes.forEach(function (node) {
        // constrain x and y positions to within viewing area
        node.x = Math.max(Math.min(node.x, width), 0);
        node.y = Math.max(Math.min(node.y, height), 0);
      });
    }

    /**
     * Gets node-relative tooltip positioning information from a node.
     * Based on how close the node is to the border/sides of the visualization.
     *
     * @param {Node} node
     * @return {string} tooltip direction (one of: n, ne, e, se, s, sw, w, nw)
     */
    function tooltipDirection(node) {
      var dir = '';

      // control top/bottom based on proximity to borders
      if (node.y > height - TIP_POSITION_MARGIN.bottom) dir += 'n';
      else if (node.y < TIP_POSITION_MARGIN.top) dir += 's';

      // control side based on proximity to borders
      if (node.x > width - TIP_POSITION_MARGIN.right) dir += 'w';
      else if (node.x < TIP_POSITION_MARGIN.left) dir += 'e';

      // fall back to top
      if (dir === '') dir = 'n';

      return dir;
    }

     /**
      * Controls how far to place the tooltip from the point at which the node is located.
      * Offset coordinates based on how close the node is to the border/sides of the visualization
      * (i.e. the node's radius)
      *
      * @param {Node} node
      * @return {integer[]} tooltip x/y offset coordinates
      */
    function tooltipOffset(node) {
      var sz = centralityMetric(node);
      var radius = nodeRadiusScale(sz);
      var offset = [0, 0];

      if (node.y > height - TIP_POSITION_MARGIN.bottom) offset[0] -= radius;
      else if (node.y < TIP_POSITION_MARGIN.top) offset[0] += radius;

      if (node.x > width - TIP_POSITION_MARGIN.left_right) offset[1] -= radius;
      else if (node.x < TIP_POSITION_MARGIN.left_right) offset[1] += radius;

      if (offset[1] === 0 && offset[0] === 0) offset[0] -= radius;

      return offset;
    }

    /**
     * Sets arrowhead definitions on the SVG defs element
     *
     * @param  {object} svg
     */
    function defineArrowheads(svg, edgeTypes, classTypes) {
      var arrowTypes = [];
      edgeTypes.forEach(function (type) {
        classTypes.forEach(function (cls) {
          arrowTypes.push('arrowhead-' + type + (cls ? '-' + cls : ''));
        });
      });

      // arrowhead definitions
      svg.append('defs').selectAll('marker')
          .data(arrowTypes)
        .enter().append('marker')
          .attr('id', function(id) { return id; })
          .attr('viewBox', '0 -4 10 8')
          .attr('refX', 25)
          .attr('refY', 0)
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .attr('orient', 'auto')
        .append('path')
          .attr('d', 'M 0,-4 L 10,0 L 0,4');
    }
  }

  return ConceptBrowser;

  function debounce(fn, wait, leading, trailing) {
    var timeout;

    if (typeof leading === 'undefined') {
      leading = true;
    }

    if (typeof trailing === 'undefined') {
      trailing = false;
    }

    return function () {
      var ctx = this;
      var args = arguments;

      var callNow = leading && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        fn.apply(ctx, args);
      }

      function later() {
        timeout = null;
        if (trailing) {
          fn.apply(ctx, args);
        }
      }
    };
  }

});
