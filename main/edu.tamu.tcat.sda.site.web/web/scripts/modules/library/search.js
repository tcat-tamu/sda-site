define(function (require) {

   // Main AppModule for the search page. May be refactored to support
   // more modular searching

   var Backbone = require('backbone');
   var Marionette = require('marionette');
   var Radio = require('backbone.radio');

   var Widgets = require('trc-ui-widgets');
   var WorkRepository = require('trc-entries-biblio');

   var Config = require('config');

   var Views = require('./work_views');



   var SearchController = Marionette.Controller.extend({

      initialize: function (opts) {
         this.mergeOptions(opts, ['region', 'repository', 'routerChannel']);

         var _this = this;
         this.searchForm = new Widgets.Controls.SearchForm({
            searchProvider: function (q, limit) {
               _this.routerChannel.command('work:search', q);

               return _this.repository.search(q, { limit: limit })
                  .filter(function (workSearchProxy) {
                     return workSearchProxy.uri.match(/^works\/\d+$/);
                  })
                  .map(function (workSearchProxy) {
                     return {
                        title: workSearchProxy.label,
                        description: null,
                        obj: workSearchProxy
                     };
                  });
            }
         });

         this.region.show(this.searchForm.getView());

         this.listenTo(this.searchForm, 'result:click', function (workSearchProxy) {
            this.routerChannel.command('work:show', workSearchProxy.uri, { trigger: true });
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
      controller: new SearchController({
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


   Backbone.history.start();


});
