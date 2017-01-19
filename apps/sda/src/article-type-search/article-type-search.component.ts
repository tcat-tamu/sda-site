import * as angular from 'angular';

export const component: angular.IComponentOptions = {
  template: require('./article-type-search.html'),

  bindings: {
    type: '@',
    onClickArticle: '&'
  },

  /** @ngInject */
  controller(articlesRepo: any) {
    var $ctrl = this;

    $ctrl.search = search;

    // pre-populate results
    search('');

    function search(query: string): void {
      $ctrl.results = articlesRepo.search(query, { type: $ctrl.type });
    }
  }
};
