define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var LayoutView = require('./views/layout_view');

   var SearchFormView = require('./views/search_form_view');
   var ResultsView = require('./views/results_view');


   var SearchController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.region) {
            throw new TypeError('no form region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no repository provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['region', 'repo', 'channel']);
      },

      ensureLayoutView: function () {
         if (!this.layoutView) {
            this.layoutView = new LayoutView();

            this.layoutView.on('destroy', function () {
               this.layoutView = null;
            }, this);

            this.region.show(this.layoutView);
         }

         return this.layoutView;
      },

      ensureSearchFormView: function () {
         if (!this.searchFormView) {
            this.searchFormView = new SearchFormView();

            this.searchFormView.on('search', function (query, searchOptions) {
               this.channel.trigger('search', query, searchOptions);
            }, this);

            this.searchFormView.on('destroy', function () {
               this.searchFormView = null;
            }, this);

            var layout = this.ensureLayoutView();
            layout.getRegion('left').show(this.searchFormView);
         }

         return this.searchFormView;
      },

      search: function (query, searchOptions) {
         this.ensureSearchFormView();

         if (query != null) {
            this.repo.search(query, searchOptions)
               .bind(this)
               .then(function (results) {
                  var resultsView = new ResultsView({
                     collection: results.articles
                  });

                  resultsView.on('read:more', function (article) {
                     this.channel.trigger('article:show', article.id);
                  }, this);

                  var layout = this.ensureLayoutView();
                  layout.getRegion('main').show(resultsView);
               });
         }
      }
   });


   var SearchRouter = Marionette.AppRouter.extend({
      appRoutes: {
         '': 'ensureSearchFormView',
         'q=:query': 'search'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new SearchController({
            region: opts.region,
            repo: opts.repo,
            channel: opts.channel
         });

         var router = new SearchRouter({
            controller: controller
         });

         opts.channel.on('search', function (query, searchOptions) {
            if (query.length > 0) {
               router.navigate('q=' + query);
            }
            controller.search(query, searchOptions);
         });

         return router;
      }
   };

});
