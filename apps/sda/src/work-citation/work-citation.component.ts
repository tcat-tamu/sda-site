import * as angular from 'angular';

export const component: angular.IComponentOptions = {
  template: require('./work-citation.html'),
  bindings: {
    authors: '<',
    title: '<',
    pubInfo: '<',
    edition: '<',
    volume: '<'
  }
};
