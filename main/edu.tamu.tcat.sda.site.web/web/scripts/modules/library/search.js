define(function (require) {

   // Main AppModule for the search page. May be refactored to support
   // more modular searching

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');
   var _ = require('underscore');
   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');
   var Promise = require('promise');

   var Widgets = require('trc-ui-widgets');
   var WorkRepository = require('trc-entries-biblio');
   var RelationshipRepository = require('trc-entries-reln');

   var Config = require('config');

   var Views = require('./work_views');
   var HathitrustBookReaderView = require('./bookreader');

   var ViewModels = require('./view_models');
   var SimpleRelationshipCollection = ViewModels.SimpleRelationships;


   var WorkSearchResultView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'trc/entries/ui/biblio/simple_search_result.html'),
      className: 'work-search-result',

      events: {
         'click ol.authorList span.author': function(event) {
            event.stopPropagation();

            var authorId = event.target.dataset.id;
            if (!authorId) {
               return;
            }

            var authors = this.model.get('authors');
            var authorRef = _.findWhere(authors, {
               authorId: authorId
            });

            if (!authorRef) {
               return;
            }

            this.trigger('author:click', authorRef);
         },

         'click': function() {
            this.trigger('work:click', this.model);
         }
      }
   });

   var BookSearchController = Marionette.Controller.extend({

      initialize: function (opts) {
         this.mergeOptions(opts, ['region', 'worksRepository', 'routerChannel']);

         var _this = this;
         this.searchForm = new Widgets.Controls.SearchForm({
            placeholder: 'Search Books',
            resultView: WorkSearchResultView,
            searchProvider: function (q, limit) {
               _this.routerChannel.command('work:search', q);

               return _this.worksRepository.search(q, { limit: limit })
                  .filter(function (workSearchProxy) {
                     return workSearchProxy.uri.match(/^works\/\d+$/);
                  });
            }
         });

         this.region.show(this.searchForm.getView());

         this.listenTo(this.searchForm, 'result:author:click', function(authorRef)
         {
            this.routerChannel.command('author:show', authorRef.authorId, { trigger: true });
         });

         this.listenTo(this.searchForm, 'result:work:click', function(workSearchProxy)
         {
            this.routerChannel.command('work:show', workSearchProxy.get('uri'), { trigger: true });
         });
      },

      searchForWork: function (q) {
         if (this.region.currentView !== this.searchForm.getView()) {
            this.region.show(this.searchForm.getView());
         }

         if (q) {
            this.searchForm.search(q);
         }
      }
   });


   var WorkDisplayController = Marionette.Controller.extend({

      initialize: function (opts) {
         this.mergeOptions(opts, ['region', 'worksRepository', 'copiesRepository', 'relationshipsRepository', 'routerChannel']);

         this.relnTypesPromise = this.relationshipsRepository.findTypes();
      },

      displayBiblioWork: function (id) {
         var _this = this;
         // TODO start spinner

         var workPromise = this.worksRepository.findWork(id);

         var copyRefsPromise = workPromise.then(function (work) {
            return _this.copiesRepository.findAll(work.getUri());
         });

         var relationshipsPromise = workPromise.then(function (work) {
            return _this.relationshipsRepository.findAllByUri(work.getUri());
         });

         /**
          * Transform a collection of anchors into attributes for simple relationships,
          * each containing a relationship type name and a target work object.
          *
          * @param  {string}              typeName Name of relationship type already normalized for reverse relationships
          * @param  {Backbone.Collection} anchors  Collection of anchors to transform
          * @return {array}                        An array of promises that resolve to simple relationship attributes.
          */
         function getSimpleRelationshipsPromise(typeName, anchors) {
            return anchors.chain()
               .invoke('get', 'entryUris')
               .flatten(true)
               .map(function (uri) {
                  return _this.worksRepository.find(uri).then(function (relatedEntry) {
                     return {
                        type: typeName,
                        target: relatedEntry.model,
                        targetType: relatedEntry.type
                     };
                  });
               })
               .value();
         }

         var typedRelationshipsPromise = Promise
            .join(workPromise, this.relnTypesPromise, relationshipsPromise, function (work, relnTypes, relationships) {
               var workUri = work.getUri();

               return relationships.chain()
                  .map(function (relationship) {
                     var typeId = relationship.get('typeId');
                     var type = relnTypes.get(typeId);

                     var isReverse = relationship.get('targetEntities').any(function (target) {
                        return _.contains(target.get('entryUris'), workUri);
                     });

                     var typeName = type.getTitle(isReverse);
                     var anchors = relationship.get(isReverse ? 'relatedEntities' : 'targetEntities');
                     return getSimpleRelationshipsPromise(typeName, anchors);
                  })
                  .flatten(true)
                  .value();
            })
            .all()
            .then(function (models) {
               return new SimpleRelationshipCollection(models);
            });

         Promise.join(workPromise, copyRefsPromise, typedRelationshipsPromise, function (work, copyRefs, relationships) {
            var workView = new Views.WorkDisplayView({
               model: work,
               copyRefs: copyRefs,
               relationships: relationships,
               routerChannel: _this.routerChannel
            });

            _this.region.show(workView);
         }).catch(function (err) {
            console.error('unable to display work');
            console.log(err);
         });
      }
   });

   var BookReaderController = Marionette.Controller.extend({
      initialize: function(opts) {
         this.mergeOptions(opts, ['region', 'copiesRepository', 'routerChannel']);
      },

      displayBookReader: function(copyId) {
         // HACK: parse HTID from copyId and display book reader
         var idParts = copyId.match(/^htid:(\d{9})#(.+)$/);
         if (!idParts) {
            throw new Error('expected HathiTrust resource identifier, received {' + copyId + '}');
         }

         var htid = idParts[2];
         var bookReaderView = new HathitrustBookReaderView({
            // HACK HACK HACK to get styling on page
            className: 'work book',
            htid: htid
         });

         this.region.show(bookReaderView);
      }
   });

   var Layout = Marionette.LayoutView.extend({
      regions: {
         'biblioDisplay': '#biblio-work-display',
         'basicBiblioSearch': '#biblio-search-basic'
      }
   });


   var SearchRouter = Marionette.AppRouter.extend({
      appRoutes: {
         '': 'searchForWork',
         'q=:query': 'searchForWork'
      },

      initialize: function (options) {
         if (!options.channel) {
            throw new TypeError('no router command channel supplied');
         }

         options.channel.comply('work:search', function (query, navOpts) {
            this.navigate('q=' + query, navOpts);
         }, this);
      }
   });


   var WorkDisplayRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'works/:id': 'displayBiblioWork'
      },

      initialize: function (options) {
         if (!options.channel) {
            throw new TypeError('no router command channel supplied');
         }

         options.channel.comply('work:show', function (uri, navOpts) {
            this.navigate(uri, navOpts);
         }, this);
      }
   });


   var BookReaderRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'read/:id': 'displayBookReader'
      },

      initialize: function (options) {
         if (!options.channel) {
            throw new TypeError('no router command channel supplied');
         }

         options.channel.comply('bookreader:show', function (copyId, navOpts) {
            this.navigate('read/' + encodeURIComponent(copyId), navOpts);
         }, this);
      }
   });



   var worksRepo = new WorkRepository({
      apiEndpoint: Config.apiEndpoint + '/works'
   });

   var copyRefsRepo = new WorkRepository.CopyReferences({
      apiEndpoint: Config.apiEndpoint + '/copies'
   });

   var relnRepo = new RelationshipRepository({
       apiEndpoint: Config.apiEndpoint + '/relationships'
   });


   var layout = new Layout({
      el: '#page_body'
   });

   var routerChannel = Radio.channel('router');

   var searchRouter = new SearchRouter({
      channel: routerChannel,
      controller: new BookSearchController({
         region: layout.getRegion('basicBiblioSearch'),
         worksRepository: worksRepo,
         routerChannel: routerChannel
      })
   });

   var workDisplayRouter = new WorkDisplayRouter({
      channel: routerChannel,
      controller: new WorkDisplayController({
         region: layout.getRegion('biblioDisplay'),
         worksRepository: worksRepo,
         copiesRepository: copyRefsRepo,
         relationshipsRepository: relnRepo,
         routerChannel: routerChannel
      })
   });

   var bookReaderRouter = new BookReaderRouter({
      channel: routerChannel,
      controller: new BookReaderController({
         region: layout.getRegion('biblioDisplay'),
         copiesRepository: copyRefsRepo,
         routerChannel: routerChannel
      })
   });


   routerChannel.comply('author:show', function (authorId) {
      console.log('showing author: ' + authorId);
   });

   Backbone.history.start();


});
