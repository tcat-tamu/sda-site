(function () {
  'use strict';

  // angular
  //   .module('sdaVwise')
  //   .provider('workspaceRepository', workspaceRepositoryProvider);

  /** @ngInject */
  function workspaceRepositoryProvider(vwise) {
    var NgWorkspaceRepository = declare(vwise);

    var provider = {
      url: '/api/vwise',
      $get: workspaceRepositoryFactory
    };

    return provider;

    /** @ngInject */
    function workspaceRepositoryFactory(panelContentMediatorRegistry, $http, $q) {
      return new NgWorkspaceRepository(panelContentMediatorRegistry, provider.url, $http, $q);
    }
  }

  /**
   * Declares and returns the NgWorkspaceRepository class.
   * Required protoypical inheritance of vwise.WorkspaceRepository makes this class definition verbose but necessary.
   * Ideally (and eventually) this should be done as an ES6 class in a separate file and loaded via an import statement.
   * @param  {vwise} vwise
   * @return {Class.<NgWorkspaceRepository>}
   */
  function declare(vwise) {
    /**
     * Angularized Workspace Repository; makes use of $http, and $q services (must be injected at construction)
     * @class
     * @extends {vwise.WorkspaceRepository}
     */
    function NgWorkspaceRepository(mediatorRegistry, url, $http, $q) {
      vwise.WorkspaceRepository.call(this, mediatorRegistry);

      // injected services and configuration options
      this.$http = $http;
      this.$q = $q;
      this.url = url;

      /**
       * A cache for storing loaded workspace instances
       * @type {vwis.Cache.<Promise.<Workspace>}
       */
      this.workspaces = new vwise.Cache;

      /**
      * A cache for storing loaded panel instances
      * @type {vwis.Cache.<Promise.<Panel>}
      */
      this.panels = new vwise.Cache;
    }

    NgWorkspaceRepository.prototype = Object.create(vwise.WorkspaceRepository.prototype);

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.createWorkspace = function createWorkspace(title) {
      var id = vwise.UUID.uuid4();
      var workspace = new vwise.Workspace(id, this);

      if (title) {
        workspace.title = title;
      }

      this.workspaces[workspace.id] = workspace;

      var url = this.url + '/workspaces';
      var dto = this.marshallWorkspace(workspace);

      // TODO what happens if this request fails?
      var workspaceP = this.$http.post(url, dto).then(function () {
        return workspace;
      });

      this.workspaces.fetch(workspace.id, workspaceP);

      return workspaceP;
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.saveWorkspace = function saveWorkspace(workspace) {
      if (!(workspace instanceof vwise.Workspace)) {
        throw new TypeError('expected instance of Workspace');
      }

      var url = this.url + '/workspaces/' + workspace.id;
      var dto = this.marshallWorkspace(workspace);

      var workspaceP = this.$http.put(url, dto).then(function() {
        return workspace;
      });

      return workspaceP;
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.getWorkspace = function getWorkspace(id) {
      var repo = this;
      return this.workspaces.fetch(id, function () {
        var url = repo.url + '/workspaces/' + id;

        var workspaceP = repo.$http.get(url).then(function (resp) {
          return repo.unmarshallWorkspace(resp.data);
        });

        workspaceP.catch(function () {
          repo.workspaces.clear(id);
        });

        return workspaceP;
      });
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.createPanel = function createPanel(mediator, workspace) {
      var id = vwise.UUID.uuid4();
      var repo = this;
      var panel = new vwise.Panel(id, mediator, workspace, function (p) {
        repo.savePanel(p);
      });

      this.panels[workspace.id + ':' + panel.id] = panel;

      var url = this.url + '/workspaces/' + workspace.id + '/panels';
      var dto = this.marshallPanel(panel);

      // TODO what happens if this request fails?
      var panelP = this.$http.post(url, dto).then(function () {
        return panel;
      });

      this.panels.fetch(panel.id, panelP);

      return panelP;
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.savePanel = function savePanel(panel) {
      if (!(panel instanceof vwise.Panel)) {
        throw new TypeError('expected instance of Panel');
      }

      var url = this.url + '/workspaces/' + panel.workspace.id + '/panels/' + panel.id;
      var dto = this.marshallPanel(panel);

      return this.$http.put(url, dto).then(function () {
        return panel;
      });
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.getPanel = function getPanel(workspaceId, panelId) {
      var id = workspaceId + ':' + panelId;
      var repo = this;
      return this.panels.fetch(id, function () {
        var url = repo.url + '/workspaces/' + workspaceId + '/panels/' + panelId;

        var panelP = repo.$http.get(url).then(function (resp) {
          return repo.unmarshallPanel(resp.data);
        });

        panelP.catch(function () {
          repo.panels.clear(id);
        });

        return panelP;
      });
    };

    return NgWorkspaceRepository;
  }

})();
