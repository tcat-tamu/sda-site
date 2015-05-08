define(function (require) {

   // Main AppModule for the search page. May be refactored to support
   // more modular searching

   var Backbone = require('backbone');
   var Marionette = require('marionette');
   var Radio = require('backbone.radio');

   var Widgets = require('trc-ui-widgets');
   var WorkRepository = require('trc-entries-biblio');
   var BookreaderView = require('modules/library/bookreader');


   var repo = new WorkRepository({
      apiEndpoint: '/api/catalog/works'
   });



   var SearchController = Marionette.Controller.extend({

      initialize: function (opts) {
         this.mergeOptions(opts, ['region', 'repository', 'router']);

         var _this = this;
         this.searchForm = new Widgets.Controls.SearchForm({
            searchProvider: function (q, limit) {
               _this.router.command('work:search', q);

               return _this.repository.search(q, { limit: limit })
                  .map(function (workSearchProxy) {
                     return {
                        title: workSearchProxy.label,
                        description: null,
                        obj: workSearchProxy
                     };
                  });
            }
         });

         this.searchForm.on('result:click', function (workSearchProxy) {
            this.router.command('work:show', workSearchProxy.uri);
         });
      },

      displayBiblioWork: function (id) {
         this.region.show(new BookreaderView({
            htid: id
         }));
      },

      searchForWork: function (q) {
         this.region.show(this.searchForm.getView());
         if (q) {
            this.searchForm.search(q);
         }
      }
   });


   var Layout = Marionette.LayoutView.extend({
      regions: {
         'bookreader': '#bookreader',
         'basicBiblioSearch': '#biblio-search-basic'
      }
   });


   var layout = new Layout({
      el: '#page_body'
   });


   var routerChannel = Radio.channel('router');


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

   var searchRouter = new SearchRouter({
      channel: routerChannel,
      controller: new SearchController({
         region: layout.getRegion('basicBiblioSearch'),
         repository: repo,
         router: routerChannel
      })
   });


   routerChannel.comply('work:show', function (uri) {
      // trigger appropriate API to show work
      console.log('showing work: ' + uri);
   });

   Backbone.history.start();


});
