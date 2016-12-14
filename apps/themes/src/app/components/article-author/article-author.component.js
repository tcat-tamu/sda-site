(function () {
  'use strict';

  angular
    .module('sdaReader')
    .component('articleAuthor', {
      template: '<a ng-if="c.e" href="mailto:{{c.e}}">{{c.n}}</a><span ng-if="!c.e">{{c.n}}</span>{{c.a ? ", " : ""}}<span class="affiliation" ng-if="c.a">{{c.a}}</span>',
      controller: ArticleAuthorController,
      controllerAs: 'c',
      bindings: {
        author: '<'
      }
    });

  function ArticleAuthorController($scope) {
    // short names help keep above template manageable at the cost of some readability
    // c = controller
    var c = this;

    $scope.$watch('c.author', function (author) {
      if (!author) {
        return;
      }


      // n = name
      c.n = author.name || (author.firstname + ' ' + author.lastname);

      // e = email
      c.e = author.properties.email;

      // a = affilation
      c.a = author.properties.affiliation;
    }, true);
  }

})();
