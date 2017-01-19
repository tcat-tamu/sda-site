(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .component('articleTypeSearch', {
      templateUrl: 'app/admin/editors/articles/components/article-type-search/article-type-search.html',
      bindings: {
        type: '@',
        onClickArticle: '&'
      },
      controller: ArticleTypeSearchController
    });

  /** @ngInject */
  function ArticleTypeSearchController($log, articlesRepo) {
    var vm = this;

    vm.search = search;

    activate();

    // PUBLIC METHODS

    /**
     * Populates controller search results with the results of the given query for this component's article type
     *
     * @param {string} query
     */
    function search(query) {
      vm.results = articlesRepo.search(query, { type: vm.type });
    }

    // PRIVATE METHODS

    /**
     * Activator; called when the component has been initialized
     */
    function activate() {
      search('');
    }
  }

})();
