(function () {
  'use strict';

  angular
    .module('vwise')
    .provider('workspaceRepository', workspaceRepositoryProvider);

  /** @ngInject */
  function workspaceRepositoryProvider(vwise) {
    var NgWorkspaceRepository = declare(vwise);

    var provider = {
      db: {
        name: 'vwise'
      },
      $get: workspaceRepositoryFactory
    };

    return provider;

    /** @ngInject */
    function workspaceRepositoryFactory(panelContentMediatorRegistry, $http, $q, pouchDB) {
      var db = pouchDB(provider.db);
      return new NgWorkspaceRepository(panelContentMediatorRegistry, db, $q);
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
     * Angularized Workspace Repository powered via PouchDB; makes use of $q services (must be injected at construction)
     * @class
     * @extends {vwise.WorkspaceRepository}
     */
    function NgWorkspaceRepository(mediatorRegistry, db, $q) {
      vwise.WorkspaceRepository.call(this, mediatorRegistry);

      // injected services and configuration options
      this.$q = $q;
      this.db = db;

      /**
       * A cache for storing loaded workspace instances
       * @type {vwise.Cache.<Promise.<Workspace>}
       */
      this.workspaces = new vwise.Cache;

      /**
      * A cache for storing loaded panel instances
      * @type {vwise.Cache.<Promise.<Panel>}
      */
      this.panels = new vwise.Cache;
    }

    NgWorkspaceRepository.prototype = Object.create(vwise.WorkspaceRepository.prototype);

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.listWorkspaceIds = function listWorkspaceIds() {
      return this.db.allDocs({ include_docs: true }).then(function (result) {
        return result.rows
          .filter(function (row) {
            return row.doc && row.doc.type === 'workspace';
          })
          .map(function (row) {
            return row.id;
          });
      });
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.createWorkspace = function createWorkspace(title) {
      var id = vwise.UUID.uuid4();
      var workspace = new vwise.Workspace(id, this);

      if (title) {
        workspace.title = title;
      }

      return this.saveWorkspace(workspace);
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.saveWorkspace = function saveWorkspace(workspace) {
      if (!(workspace instanceof vwise.Workspace)) {
        throw new TypeError('expected instance of Workspace');
      }

      var dto = {
        _id: workspace._id || workspace.id,
        _rev: workspace._rev,
        type: 'workspace',
        workspace: this.marshallWorkspace(workspace)
      };

      // prefer saved pouchdb options, but fall back to vwise api options
      return this.db.put(dto)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('unable to save workspace');
          }

          // save pouchdb options for later usage
          workspace._id = response.id;
          workspace._rev = response.rev;

          return workspace;
        });
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.getWorkspace = function getWorkspace(id) {
      if (!id) {
        return this.$q.reject(new Error('no id provided'));
      }

      var repo = this;
      return this.workspaces.fetch(id, function () {
        return repo.db.get(id).then(function (dto) {
          return repo.unmarshallWorkspace(dto.workspace).then(function (workspace) {
            workspace._id = dto._id;
            workspace._rev = dto._rev;
            return workspace;
          });
        });
      });
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.removeWorkspace = function removeWorkspace(workspace) {
      return this.db.remove(workspace);
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.createPanel = function createPanel(mediator, workspace, content, vprops) {
      var id = vwise.UUID.uuid4();
      var repo = this;
      var panel = new vwise.Panel(id, mediator, workspace, content, vprops, function (p) {
        repo.savePanel(p);
      });

      return this.savePanel(panel);
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.savePanel = function savePanel(panel) {
      if (!(panel instanceof vwise.Panel)) {
        throw new TypeError('expected instance of Panel');
      }

      var dto = {
        _id: panel._id || panel.id,
        _rev: panel._rev,
        type: 'panel',
        panel: this.marshallPanel(panel)
      };

      return this.db.put(dto)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('unable to save panel');
          }

          // save pouchdb options for later usage
          panel._id = response.id;
          panel._rev = response.rev;

          return panel;
        });
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.getPanel = function getPanel(panelId, workspace) {
      if (!panelId) {
        return this.$q.reject(new Error('no id provided'));
      }

      var repo = this;
      return this.panels.fetch(panelId, function () {
        return repo.db.get(panelId).then(function (dto) {
          return repo.unmarshallPanel(dto.panel, workspace).then(function (panel) {
            panel._id = dto._id;
            panel._rev = dto._rev;
            return panel;
          });
        });
      });
    };

    /**
     * @inheritdoc
     */
    NgWorkspaceRepository.prototype.removePanel = function removePanel(panel, workspace) {
      if (workspace) {
        workspace.removePanel(panel);
      }

      return this.db.remove(panel);
    };

    return NgWorkspaceRepository;
  }

})();
