import * as angular from 'angular';

import './sda-header.scss';

export const component: angular.IComponentOptions = {
  template: require('./sda-header.html'),
  bindings: {
    activeUrl: '@',
    mdSidenavId: '@',
    showOxfordLogo: '='
  },

  /** @ngInject */
  controller($mdSidenav: angular.material.ISidenavService) {
    this.toggleSidenav = (id) => $mdSidenav(id).toggle();
  }
};
