/*global ConceptBrowser:false*/
(function () {
  'use strict';

  angular
    .module('sda.concept-browser')
    .directive('conceptBrowser', conceptBrowserDirective);

  /** @ngInject */
  function conceptBrowserDirective($window, $timeout) {
    var directive = {
      restrict: 'E',
      scope: {
        graph: '=ngModel',
        width: '=',
        height: '=',
        padding: '=',
        layout: '@',
        activeNode: '=',
        sizeMetric: '=',
        selectMode: '=',
        highlightedNodes: '=',
        relnTypes: '='
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el) {
      var width = scope.width;
      var autoWidth = false;
      var height = scope.height;
      var autoHeight = false;
      var layout = scope.layout;
      var rootEl = el.get(0);

      // HACK: delay initialization until flex elements have a width/height
      $timeout(function () {
        if (!width) {
          width = el.width();
          autoWidth = true;
        }

        if (!height) {
          height = el.height();
          autoHeight = true;
        }

        var graph = ConceptBrowser(rootEl, layout)
          .size([width, height])
          .edgeFilter(function (edge) {
            return scope.relnTypes.length === 0 || scope.relnTypes.indexOf(edge.relation) >= 0;
          });

        if (scope.sizeMetric) {
          graph.nodeCentralityMetric(scope.sizeMetric);
        }

        if (scope.selectMode) {
          graph.selectMode(scope.selectMode);
        }

        if (scope.graph) {
          graph.data(scope.graph.nodes, scope.graph.edges);
          graph.refresh();
        }

        angular.element($window).on('resize', function () {
          if (!autoWidth && !autoHeight) {
            return;
          }

          var oldWidth = width;
          var oldHeight = height;

          if (autoWidth) {
            width = el.width();
          }

          if (autoHeight) {
            height = el.height();
          }

          if (oldWidth !== width || oldHeight !== height) {
            graph.size([width, height]);
            graph.refresh();
          }
        });

        // listen for graph events

        // HACK if digest is already in progress, do not try to set active node (probably because it was set from the parent scope)
        var preventActivate = false;
        graph.on('activate', function (evt) {
          if (preventActivate) {
            return;
          }

          scope.$apply(function () {
            scope.activeNode = evt.node;
          });
        });

        // listen for data updates
        scope.$watchGroup(['width', 'height', 'graph', 'activeNode', 'sizeMetric', 'selectMode'], function (newValues, oldValues) {
          var queueRefresh = false;

          if (newValues[0] && newValues[0] !== oldValues[0]) {
            width = newValues[0];
            graph.size([width, height]);
            if (newValues[2]) {
              queueRefresh = true;
            }
          }

          if (newValues[1] && newValues[1] !== oldValues[1]) {
            height = newValues[1];
            graph.size([width, height]);
            if (newValues[2]) {
              queueRefresh = true;
            }
          }

          if (newValues[2] && newValues[2] !== oldValues[2]) {
            // make a copy of the data so changes within this directive don't get leaked out
            var graphData = angular.copy(newValues[2]);
            graph.data(graphData.nodes, graphData.edges);
            queueRefresh = true;
          }

          if (newValues[3] !== oldValues[3]) {
            preventActivate = true;
            graph.activate(newValues[3]);
            preventActivate = false;
          }

          if (newValues[4] && newValues[4] !== oldValues[4]) {
            graph.nodeCentralityMetric(newValues[4]);
            queueRefresh = true;
          }

          if (newValues[5] && newValues[5] !== oldValues[5]) {
            graph.selectMode(newValues[5]);
          }

          if (queueRefresh) {
            graph.refresh();
          }
        });

        scope.$watchCollection('highlightedNodes', function (newValues) {
          if (newValues) {
            graph.highlight(newValues);
          }
        });

        scope.$watchCollection('relnTypes', function (newValues) {
          if (newValues) {
            graph.updateGraphSelections();
          }
        });
      });
    }
  }

})();
