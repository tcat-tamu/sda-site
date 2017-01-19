import * as angular from 'angular';

import './collapsible-summary.scss';

const CHAR_THRESHOLD = 500;

export const component: angular.IComponentOptions = {
  template: require('./collapsible-summary.html'),

  bindings: {
    content: '<'
  },

  /** @ngInject */
  controller($scope) {
    $scope.$watch('$ctrl.content', newContent => this.longEnough = (!newContent || newContent.length > CHAR_THRESHOLD))
  }
}
