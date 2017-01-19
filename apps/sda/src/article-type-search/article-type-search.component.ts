import * as angular from 'angular';

export const component: angular.IComponentOptions = {
  template: require('./article-type-search.html'),

  bindings: {
    type: '@',
    onClickArticle: '&'
  },

  /** @ngInject */
  controller($scope: angular.IScope, articlesRepo: any) {
    var $ctrl = this;

    $ctrl.loading = false;

    $ctrl.search = search;

    activate();

    function activate(): void {
      // populate results when type changes
      $scope.$watch('$ctrl.type', newType => search($ctrl.query));
    }

    function search(query: string): void {
      $ctrl.results = null;

      // populate results only if we have a type
      if ($ctrl.type) {
        $ctrl.loading = true;
        $ctrl.results = articlesRepo.search(query, { type: $ctrl.type });
        $ctrl.results.$promise.then(() => $ctrl.loading = false);
      }
    }
  }
};
