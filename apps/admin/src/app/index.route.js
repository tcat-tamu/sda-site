(function () {
  'use strict';

  angular
    .module('sdaAdmin')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('editor', {
        url: '/?q',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })

      .state('editor.person', {
        url: 'people/:id',
        views: {
          main: {
            templateUrl: 'app/person/person.html',
            controller: 'ShowPersonController',
            controllerAs: 'vm'
          }
        }
      })

      .state('editor.work', {
        url: 'works/:workId',
        views: {
          main: {
            templateUrl: 'app/work/work.html',
            controller: 'ShowWorkController',
            controllerAs: 'vm'
          }
        }
      })
      .state('editor.edition', {
        url: 'works/:workId/editions/:editionId',
        views: {
          main: {
            templateUrl: 'app/work/edition.html',
            controller: 'ShowEditionController',
            controllerAs: 'vm'
          }
        }
      })
      .state('editor.volume', {
        url: 'works/:workId/editions/:editionId/volumes/:volumeId',
        views: {
          main: {
            templateUrl: 'app/work/volume.html',
            controller: 'ShowVolumeController',
            controllerAs: 'vm'
          }
        }
      })

      .state('article', {
        url: '/articles',
        templateUrl: 'app/admin/editors/articles/article.html',
        controller: 'ArticleEditorSectionController',
        controllerAs: 'vm'
      })

      .state('article.edit', {
        url: '/:id',
        templateUrl: 'app/admin/editors/articles/article-editor.html',
        controller: 'ArticleEditorController',
        controllerAs: 'vm'
      })

      .state('task', {
        url: '/task',
        templateUrl: 'app/task/task.html',
        controller: 'TaskController',
        controllerAs: 'vm'
      })

      .state('task.show', {
        url: '/:taskId',
        templateUrl: 'app/task/show.html',
        controller: 'ShowTaskController',
        controllerAs: 'vm'
      })

      .state('vwise', {
        url: '/vwise/:workspaceId',
        templateUrl: 'app/vwise/workspace.html',
        controller: 'WorkspaceController',
        controllerAs: 'vm'
      })

      .state('zotero', {
        url: '/zotero',
        templateUrl: 'app/zotero/test/test.html',
        controller: 'ZoteroTestController',
        controllerAs: 'vm'
      });



    $urlRouterProvider.otherwise('/');
  }

})();
