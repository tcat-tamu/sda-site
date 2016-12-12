(function () {
  'use strict';

  angular
    .module('sdaVwise')
    .directive('personPanel', personPanelDirective);

  var NAME_KEYS = ['title', 'givenName', 'middleName', 'familyName', 'suffix'];

  /** @ngInject */
  function personPanelDirective(_) {
    var directive = {
      restrict: 'E',
      require: '^^vwisePanel',
      templateUrl: 'app/vwise/components/person-panel/person-panel.html',
      scope: {
        person: '=',
        vprops: '='
      },
      link: linkFunc,
      controller: PersonPanelController,
      controllerAs: 'panel'
    };

    return directive;

    function linkFunc(scope, el, attr, panel) {
      panel.addActionButton(createExpandCollapseButton());

      var name = scope.person.name;

      scope.name = name.label || _.at(name, NAME_KEYS)
        .map(function (n) { return n.trim(); })
        .filter(_.identity)
        .join(' ');

      /**
       * @return {object}
       */
      function createExpandCollapseButton() {
        var origSize = {
          width: scope.vprops.width,
          height: scope.vprops.height
        };

        var panelLabel = el.find('.panel-label');

        var button = {
          label: 'collapse',
          icon: 'expand_less',
          handler: toggleCollapse
        };

        return button;

        function toggleCollapse() {
          if (button.icon === 'expand_less') {
            origSize.width = scope.vprops.width;
            origSize.height = scope.vprops.height;
            scope.vprops.width = panelLabel.outerWidth() + 10;
            scope.vprops.height = panelLabel.outerHeight();
            button.label = 'expand';
            button.icon = 'expand_more';
          } else {
            scope.vprops.width = origSize.width;
            scope.vprops.height = origSize.height;
            button.label = 'collapse';
            button.icon = 'expand_less';
          }
        }
      }
    }

    /** @ngInject */
    function PersonPanelController($scope, $q, worksRepo, peopleRepo, relnRepo) {
      var vm = this;

      vm.works = [];

      activate();

      function activate() {
        var id = $scope.person.id;

        var worksP = getWorksAuthored(id);
        worksP.then(function (works) {
          vm.works = works;
        });

        var relatedP = worksP.then(function (works) {
          return getRelatedPeople(works);
        });

        relatedP.then(function (related) {
          vm.relatedPeople = related;
        });
      }

      function getWorksAuthored(authorId) {
        var result = worksRepo.searchByAuthor(authorId);
        return result.$promise.then(function () {
          result.items.forEach(function (work) {
            work.type = 'work';
          });

          return result.items;
        });
      }

      function getRelatedPeople(works) {
        // fetch relationships for all works
        /** @type Promise.<TypeGroup[]>[] */
        var relnsPs = works.map(function (work) {
          return getRelationships(work.id);
        });

        // combine grouped relationships for all works into a single set of grouped relationships
        /** @type Promise.<TypeGroup[]> */
        var relnsP = $q.all(relnsPs).then(function (relnss) {
          return _.chain(relnss)    // Stream.<TypeGroup[]>
            .flatten()              // Stream.<TypeGroup>
            .groupBy(function (group) {
              return group.type.identifier + '-' + (group.reverse ? 'rev' : 'fwd');
            })                      // Stream.<String, TypeGroup[]>
            .map(function (groups) {
              var group = _.clone(groups[0]);
              group.relationships = _.flatMap(groups, 'relationships');
              return group;
            })                      // Stream.<TypeGroup>
            .value();
        });

        // resolve related entities in all relationships to a set of authors
        var relatedPeople = relnsP.then(function (groups) {
          /** @type Promise.<TypeGroup>[] */
          var groupPs = groups.map(function (group) {
            /** @type Promise.<string[]>[] */
            var authorIdsPs = _.chain(group.relationships)  // Stream.<NormalizedRelationship>
            .flatMap('entities')                            // Stream.<Entity>
            .map('entity')                                  // Stream.<Work|Edition|Volume>
            .map(function (entity) {
              return entity.$promise.then(function (entity) {
                var authorIds = _.map(entity.authors, 'authorId');
                return authorIds;
              });
            })                                              // Stream.<Promise.<string[]>>
            .value();

            /** @type Promise.<string[]> */
            var authorIdsP = $q.all(authorIdsPs).then(function (authorIdss) {
              return _.chain(authorIdss)
                .flatten()
                .filter()
                .uniq()
                .value();
            });

            /** @type Promise.<Person[]> */
            group.relationships = authorIdsP.then(function (authorIds) {
              /** @type Promise.<Person>[] */
              var authorPs = authorIds.map(function (id) {
                var author = peopleRepo.get(id);
                author.$promise.then(function () {
                  author.type = 'person';
                });
                return author.$promise;
              });

              return $q.all(authorPs);
            });

            return $q.all(group);
          });

          return $q.all(groupPs);
        });

        return relatedPeople;
      }

      /**
       * Fetches relationships for the given work.
       * @param  {string} workId
       * @return {Promise.<TypeGroup[]>}
       */
      function getRelationships(workId) {
        var uri = 'works/' + workId;
        var result = relnRepo.search(uri);

        var normRelnsP = result.$promise.then(function (relns) {
          var normRelns = relnRepo.normalizeRelationships(relns, uri, worksRepo);
          return normRelns.$promise;
        });

        return normRelnsP;
      }
    }
  }

})();
