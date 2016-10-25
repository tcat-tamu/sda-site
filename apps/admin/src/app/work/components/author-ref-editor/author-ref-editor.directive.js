(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .directive('authorRefEditor', authorRefEditorDirective);

  /** @ngInject */
  function authorRefEditorDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/work/components/author-ref-editor/author-ref-editor.html',
      scope: {
        ref: '=ngModel'
      },
      controller: AuthorRefEditorController,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function AuthorRefEditorController($scope, peopleRepo) {
      var vm = this;

      vm.linkAuthorSearchText = '';
      vm.authorRoles = [
        'author',
        'editor',
        'translator',
        'other'
      ];

      vm.setLinkedAuthor = setLinkedAuthor;
      vm.getResults = getResults;

      activate();

      function activate() {
        if ($scope.ref.authorId) {
          var author = peopleRepo.get($scope.ref.authorId);
          author.$promise.then(function () {
            vm.linkAuthorSearchText = author.name.label;
          })
        }
      }

      function setLinkedAuthor(person) {
        $scope.ref.authorId = person.id;
      }

      function getResults(query) {
        var resultSet = peopleRepo.search(query);
        return resultSet.$promise.then(function () {
          return resultSet.items;
        });
      }

    }
  }

})();
