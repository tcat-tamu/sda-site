define(function (require) {

   // Main AppModule for the search page. May be refactored to support
   // more modular searching

   var Backbone = require('backbone');
   var Radio = require('backbone.radio');
   var _ = require('underscore');
   var Marionette = require('marionette');
   var nunjucks = require('nunjucks');

   var Widgets = require('trc-ui-widgets');
   var WorkRepository = require('trc-entries-biblio');

   var Config = require('config');

   var Views = require('./work_views');


   var WorkSearchResultView = Marionette.ItemView.extend({
      template: _.partial(nunjucks.render, 'trc/entries/ui/biblio/simple_search_result.html'),
      className: 'work-search-result',

      events: {
         'click ol.authorList span.author': function(event) {
            var el = event.target;

            var authors = this.model.get('authors');
            var authorRef = _.findWhere(authors, {
               authorId: el.dataset.id
            });
            event.stopPropagation();
            this.trigger('author:click', authorRef);
         },

         'click': function() {
            this.trigger('work:click', this.model);
         }
      }
   });

   var BookSearchController = Marionette.Controller.extend({

      initialize: function (opts) {
         this.mergeOptions(opts, ['region', 'repository', 'routerChannel']);

         var _this = this;
         this.searchForm = new Widgets.Controls.SearchForm({
            placeholder: 'Search Books',
            resultView: WorkSearchResultView,
            searchProvider: function (q, limit) {
               _this.routerChannel.command('work:search', q);

               return _this.repository.search(q, { limit: limit })
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
         this.mergeOptions(opts, ['region', 'repository', 'routerChannel']);
      },

      displayBiblioWork: function (id) {
         var _this = this;
         this.repository.findWork(id).then(function (work) {
            var workView = new Views.WorkDisplayView({
               model: work
            });

            _this.region.show(workView);
         }).catch(function (err) {
            console.error('unable to display work');
            console.log(err);
         });
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



   var repo = new WorkRepository({
      apiEndpoint: Config.apiEndpoint + '/works'
   });


   var layout = new Layout({
      el: '#page_body'
   });

   var routerChannel = Radio.channel('router');

   var searchRouter = new SearchRouter({
      channel: routerChannel,
      controller: new BookSearchController({
         region: layout.getRegion('basicBiblioSearch'),
         repository: repo,
         routerChannel: routerChannel
      })
   });

   var workDisplayRouter = new WorkDisplayRouter({
      channel: routerChannel,
      controller: new WorkDisplayController({
         region: layout.getRegion('biblioDisplay'),
         repository: repo,
         routerChannel: routerChannel
      })
   });


   routerChannel.comply('author:show', function (authorId) {
      console.log('showing author: ' + authorId);
   });

   Backbone.history.start();


});
