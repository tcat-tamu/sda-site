(function () {
  'use strict';

  // HACK types should be loaded from reln repo
  var TYPES = {
    'uk.ac.ox.bodleian.sda.relationships.influence': {
      id: 'uk.ac.ox.bodleian.sda.relationships.influence',
      title: 'Influenced',
      reverseTitle: 'Influenced By',
      directed: true
    },
    'uk.ac.ox.bodleian.sda.relationships.provoked': {
      id: 'uk.ac.ox.bodleian.sda.relationships.provoked',
      title: 'Provoked',
      reverseTitle: 'Provoked By',
      directed: true
    },
    'uk.ac.ox.bodleian.sda.relationships.patternmatch': {
      id: 'uk.ac.ox.bodleian.sda.relationships.patternmatch',
      title: 'Possible Pattern Match',
      directed: false
    }
  };

  angular
    .module('sdaConceptBrowser')
    .controller('ConceptBrowserController', ConceptBrowserController);

  /** @ngInject */
  function ConceptBrowserController($scope, $mdToast, $stateParams, $filter, $timeout, _, helpDialog, peopleRepo, worksRepo, graphRepo) {
    var vm = this;

    vm.toggleSearchForm = toggleSearchForm;
    vm.clearSearchForm = clearSearchForm;
    vm.showSearchForm = false;
    vm.searchQuery = '';
    vm.graphType = '';

    vm.showHelp = helpDialog.show;

    vm.graph = null;
    vm.activeNode = null;
    vm.nodeData = null;
    vm.works = null;
    vm.related = null;
    vm.sidebarLoading = false;
    vm.graphLoading = false;

    vm.relnTypes = TYPES;
    vm.relnTypeFilter = [];
    vm.toggleRelnTypeFilter = toggleRelnTypeFilter;

    vm.selectModes = [
      {
        label: 'Neighbors',
        strategy: function (selected) {
          if (!selected) {
            return [];
          }

          var adjacent = selected.outEdges.filter(edgeFilter).map(function (edge) {
            return edge.target;
          });
          var incident = selected.inEdges.filter(edgeFilter).map(function (edge) {
            return edge.source;
          });
          return [selected].concat(adjacent, incident);
        }
      },
      {
        label: 'Trace',
        strategy: function (selected) {
          if (!selected) {
            return [];
          }

          var worklist = [selected];
          var visited = [];

          while (worklist.length > 0) {
            var node = worklist.pop();
            visited.push(node);
            node.outEdges.forEach(function (edge) {
              if (visited.indexOf(edge.target) < 0) {
                worklist.push(edge.target);
              }
            });
          }

          return visited;
        }
      },
      {
        label: 'Inbound',
        strategy: function (selected) {
          return selected ? [selected].concat(selected.inEdges.filter(edgeFilter).map(function (edge) {
            return edge.source;
          })) : [];
        }
      },
      {
        label: 'Outbound',
        strategy: function (selected) {
          return selected ? [selected].concat(selected.outEdges.filter(edgeFilter).map(function (edge) {
            return edge.target;
          })) : [];
        }
      },
    ];
    vm.selectMode = vm.selectModes[0];

    vm.sizeMetrics = [
      {
        label: 'PageRank',
        strategy: function (node) {
          return node.metadata.pagerank;
        }
      },
      {
        label: 'Uniform',
        strategy: function () {
          return 1;
        }
      },
      {
        label: 'HITS',
        disabled: true,
        strategy: function () {
          return 1;
        }
      }
    ];
    vm.sizeMetric = vm.sizeMetrics[0];

    vm.highlightedNodes = [];

    activate();

    // HACK: this function is duplicated in the concept browser directive...
    //       need a way to tell the graph to update from outside the directive...
    function edgeFilter(edge) {
      return vm.relnTypeFilter.length === 0 || vm.relnTypeFilter.indexOf(edge.relation) >= 0;
    }

    function activate() {
      var defaultGraphType = 'people';
      vm.graphType = $stateParams.type || defaultGraphType;
      vm.graphLoading = true;

      var graphP = getGraphData(vm.graphType);

      if (defaultGraphType !== vm.graphType) {
        graphP = graphP.catch(function () {
          $mdToast.showSimple('Unable to load the "' + vm.graphType + '"graph type. Falling back to "' + defaultGraphType + '".');
          return getGraphData(defaultGraphType);
        });
      }

      graphP.then(function (data) {
        vm.graphLoading = false;
        vm.graph = data.graph;
      }, function () {
        vm.graphLoading = false;
        $mdToast.showSimple('Unable to load graph data.');
      });

      $scope.$watch('vm.activeNode', function (node) {
        if (node) {
          vm.sidebarLoading = true;
          loadNodeData(node).then(function () {
            vm.sidebarLoading = false;
          }, function () {
            vm.sidebarLoading = false;
            $mdToast.showSimple('Unable to load node data');
          });
        } else {
          vm.nodeData = null;
        }
      });

      $scope.$watch('searchQuery', function (searchQuery) {
        vm.highlightedNodes = searchQuery ? $filter('filter')(vm.graph.nodes, { label: searchQuery }) : [];
      });
    }

    function toggleRelnTypeFilter(typeId) {
      var ix = vm.relnTypeFilter.indexOf(typeId);
      if (ix < 0) {
        vm.relnTypeFilter.push(typeId);
      } else {
        vm.relnTypeFilter.splice(ix, 1);
      }
    }

    function toggleSearchForm() {
      vm.showSearchForm = !vm.showSearchForm;

      if (vm.showSearchForm) {
        $timeout(function () {
          angular.element('.search-form > input[type="search"]').focus();
        });
      } else {
        $scope.searchQuery = '';
      }
    }

    function clearSearchForm() {
      $scope.searchQuery = '';
      $timeout(function () {
        vm.showSearchForm = false;
      });
    }

    function loadNodeData(node) {
      vm.nodeData = (function () {
        switch (node.metadata.type) {
          case 'trc.entries.biographical': return peopleRepo.get(node.metadata.id);
          case 'trc.entries.bibliographic': return worksRepo.getWork(node.metadata.id);
          default: return null;
        }
      })();

      vm.related = getRelatedNodes(node);

      return vm.nodeData.$promise;
    }

    function getRelatedNodes(node) {
      var related = {};

      node.outEdges.forEach(makeEdgeHandler(related, 'target', 'out'));
      node.inEdges.forEach(makeEdgeHandler(related, 'source', 'in'));

      return _.values(related).map(function (group) {
        if (group.in && group.in.nodes) {
          group.in.nodes = _.values(group.in.nodes);
        }

        if (group.out && group.out.nodes) {
          group.out.nodes = _.values(group.out.nodes);
        }

        if (group.none && group.none.nodes) {
          group.none.nodes = _.values(group.none.nodes);
        }

        return group;
      });

      function makeEdgeHandler(groups, srcProperty, destProperty) {
        return function (edge) {
          var type = TYPES[edge.relation];
          if (!type) return;

          var group = ensureTypeGroup(groups, type);
          var node = edge[srcProperty];
          group[type.directed ? destProperty : 'none'].nodes[node.id] = node;
        }
      }

      function makeTypeGroup(type) {
        var group = { id: type.id, directed: type.directed };

        if (type.directed) {
          group.out = { label: type.title, nodes: {} };
          group.in = { label: type.reverseTitle, nodes: {} };
        } else {
          group.none = { label: type.title, nodes: {} };
        }

        return group;
      }

      function ensureTypeGroup(groups, type) {
        if (!groups.hasOwnProperty(type.id)) {
          groups[type.id] = makeTypeGroup(type);
        }

        return groups[type.id];
      }
    }

    function getGraphData(type) {
      var graph = graphRepo.get(type);

      return graph.$promise.then(function () {
        var nodesById = {};

        // index nodes by ID; prepare structure for dereferencing
        graph.graph.nodes.forEach(function (node) {
          node.inEdges = [];
          node.outEdges = [];

          nodesById[node.id] = node;
        });

        // dereference edges
        // edge direction plays an opposite role in the view than it does in the server data:
        //    suppose A provoked B, C, and D
        //    we would like to draw arrows from A to B, C, and D (A->B, A->C, A->D)
        //    but for analytical purposes, the data treats provocation as references from B, C, and D back to A (B->A, C->A, D->A)
        graph.graph.edges.forEach(function (edge) {
          var target = nodesById[edge.source];
          var source = nodesById[edge.target];

          edge.source = source;
          source.outEdges.push(edge);

          edge.target = target;
          target.inEdges.push(edge);
        });

        return graph;
      });
    }
  }

})();
