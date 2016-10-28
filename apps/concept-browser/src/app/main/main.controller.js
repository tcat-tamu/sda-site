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
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($http, $scope, $q, $mdToast, $mdDialog, $mdMedia, $location, $stateParams, $filter, $timeout, $document, peopleRepo, worksRepo, graphRepo) {
    var vm = this;

    vm.toggleSearchForm = toggleSearchForm;
    vm.clearSearchForm = clearSearchForm;
    vm.showSearchForm = false;
    vm.searchQuery = '';

    vm.showHelp = showHelp;

    vm.graph = null;
    vm.activeNode = null;
    vm.person = null;
    vm.works = null;
    vm.related = null;
    vm.sidebarLoading = false;
    vm.graphLoading = false;

    vm.relnTypes = TYPES;
    vm.relnTypeFilter = [];
    vm.toggleRelnTypeFilter = toggleRelnTypeFilter;

    vm.selectMode = null;
    vm.selectModes = [];

    vm.sizeMetric = null;
    vm.sizeMetrics = [];

    vm.highlightedNodes = [];

    activate();

    function activate() {
      loadSelectModes();
      loadSizeMetrics();

      var defaultGraphType = 'people';
      var graphType = $stateParams.type || defaultGraphType;
      vm.graphLoading = true;
      getGraphData(graphType).catch(function () {
        $mdToast.showSimple('Unable to load the "' + graphType + '"graph type. Falling back to "' + defaultGraphType + '".');
        return getGraphData(defaultGraphType);
      }).then(function (data) {
        vm.graphLoading = false;
        vm.graph = data.graph;
      }, function () {
        vm.graphLoading = false;
        $mdToast.showSimple('Unable to load graph data.');
      });

      $scope.$watch('main.activeNode', function (node) {
        if (node) {
          vm.sidebarLoading = true;
          loadNodeData(node).then(function () {
            vm.sidebarLoading = false;
          }, function () {
            vm.sidebarLoading = false;
            $mdToast.showSimple('Unable to load node data');
          });
        } else {
          vm.person = null;
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

    function loadSelectModes() {
      vm.selectModes.push({
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
      });

      vm.selectModes.push({
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
      });

      vm.selectModes.push({
        label: 'Inbound',
        strategy: function (selected) {
          return selected ? [selected].concat(selected.inEdges.filter(edgeFilter).map(function (edge) {
            return edge.source;
          })) : [];
        }
      });

      vm.selectModes.push({
        label: 'Outbound',
        strategy: function (selected) {
          return selected ? [selected].concat(selected.outEdges.filter(edgeFilter).map(function (edge) {
            return edge.target;
          })) : [];
        }
      });

      vm.selectMode = vm.selectModes[0];
    }

    function loadSizeMetrics() {
      vm.sizeMetrics.push({
        label: 'PageRank',
        strategy: function (node) {
          return node.metadata.pagerank;
        }
      });

      vm.sizeMetrics.push({
        label: 'Uniform',
        strategy: function () {
          return 1;
        }
      });

      vm.sizeMetrics.push({
        label: 'HITS',
        disabled: true,
        strategy: function () {
          return 1;
        }
      });

      vm.sizeMetric = vm.sizeMetrics[0];
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

    function showHelp($event) {
      var config = {
        targetEvent: $event,
        fullscreen: $mdMedia('sm') || $mdMedia('xs'),
        templateUrl: 'app/main/help.html',
        controller: 'HelpDialogController',
        clickOutsideToClose: true
      };

      $mdDialog.show(config)
    }

    // HACK: this function is duplicated in the concept browser directive...
    //       need a way to tell the graph to update from outside the directive...
    function edgeFilter(edge) {
      return vm.relnTypeFilter.length === 0 || vm.relnTypeFilter.indexOf(edge.relation) >= 0;
    }

    function loadNodeData(node) {
      // HACK only works for people; should probably refactor to a directive with parallel one for works,
      //      but how should we determine which directive to display?
      vm.person = peopleRepo.get(node.id);

      var works = worksRepo.searchByAuthor(node.id);
      var worksP = works.$promise.then(function () {
        if (!works.items) {
          throw new Error('unable to load items');
        }

        vm.works = works.items;
        return vm.works;
      });

      var related = {};

      function makeTypeGroup(type) {
        var group = { id: type.id, directed: type.directed };

        if (type.directed) {
          group.out = { label: type.title, nodes: [] };
          group.in = { label: type.reverseTitle, nodes: [] };
        } else {
          group.none = { label: type.title, nodes: [] };
        }

        return group;
      }

      function ensureTypeGroup(type) {
        if (!related.hasOwnProperty(type.id)) {
          related[type.id] = makeTypeGroup(type);
        }

        return related[type.id];
      }

      node.outEdges.map(function (edge) {
        var type = TYPES[edge.relation];
        if (!type) return;

        var group = ensureTypeGroup(type);
        group[type.directed ? 'out' : 'none'].nodes.push(edge.target);
      });

      node.inEdges.map(function (edge) {
        var type = TYPES[edge.relation];
        if (!type) return;

        var group = ensureTypeGroup(type);
        group[type.directed ? 'in' : 'none'].nodes.push(edge.source);
      });

      vm.related = [];
      for (var key in related) if (related.hasOwnProperty(key)) {
        vm.related.push(related[key]);
      }

      return $q.all([vm.person.$promise, worksP]);
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
