import * as angular from 'angular';

import {INavProviderService} from './sda-sitenav.service';

export const component: angular.IComponentOptions = {
  template: require('./sda-sitenav.html'),
  bindings: {
    activeUrl: '@'
  },

  /** @ngInject */
  controller(sdaSitenav: INavProviderService) {
    sdaSitenav.getLinks().then(links => this.links = links);
  }
};
