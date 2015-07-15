define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');
   var Widgets = require('trc-ui-widgets');

   var WorkSearchResultView = require('./views/work_search_result_view');


   var BookSearchController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.region) {
            throw new TypeError('no region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no repository provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['region', 'repo', 'channel']);

         var _this = this;
         this.searchForm = new Widgets.Controls.SearchForm({
            placeholder: 'Search Books',
            resultView: WorkSearchResultView,
            searchProvider: function (q, limit) {
               _this.channel.trigger('work:search', q, { execute: false });
               return _this.repo.search(q, { limit: limit })
                  .filter(function (workSearchProxy) {
                     return workSearchProxy.uri.match(/^works\/\d+$/);
                  });
            }
         });

         this.region.show(this.searchForm.getView());

         this.listenTo(this.searchForm, 'result:author:click', function(authorRef)
         {
            this.channel.trigger('author:show', authorRef.authorId);
         });

         this.listenTo(this.searchForm, 'result:work:click', function(workSearchProxy)
         {
            this.channel.trigger('work:show', workSearchProxy.id);
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


   var SearchRouter = Marionette.AppRouter.extend({
      appRoutes: {
         '': 'searchForWork',
         'q=:query': 'searchForWork'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new BookSearchController({
            region: opts.region,
            repo: opts.repo,
            channel: opts.channel
         });

         var router = new SearchRouter({
            controller: controller
         });

         opts.channel.on('work:search', function (query, searchOptions) {
            var searchOpts = _.defaults(_.clone(searchOptions) || {}, {
               execute: true
            });

            router.navigate('q=' + query);

            if (searchOpts.execute) {
               controller.searchForWork(query);
            }
         });

         return router;
      }
   };

});
