import * as angular from 'angular';

export const component: angular.IComponentOptions = {
  template: require('./sda-header.html'),
  bindings: {
    activeUrl: '@',
    mdSidenavId: '@',
  },

  /** @ngInject */
  controller($mdSidenav: angular.material.ISidenavService) {
    this.toggleSidenav = (id) => $mdSidenav(id).toggle();
  }
};
