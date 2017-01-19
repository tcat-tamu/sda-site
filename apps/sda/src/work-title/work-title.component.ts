import * as angular from 'angular';

export const component: angular.IComponentOptions = {
  template: require('./work-title.html'),
  bindings: {
    title: '<'
  },
  /** @ngInject */
  controller($scope: angular.IScope, worksRepo: any) {
    $scope.$watch('$ctrl.title', newTitle => {
      if (angular.isArray(newTitle)) {
        this.title = worksRepo.getTitle(newTitle);
      }
    });
  }
};
