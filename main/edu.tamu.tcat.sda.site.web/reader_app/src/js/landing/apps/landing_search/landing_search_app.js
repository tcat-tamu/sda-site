define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');

   var SearchFormView = require('./views/search_form_view');
   var ResultsView = require('./views/results_view');


   var SearchController = Marionette.Controller.extend({

      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         if (!opts.formRegion) {
            throw new TypeError('no form region provided');
         }

         if (!opts.resultsRegion) {
            throw new TypeError('no results region provided');
         }

         if (!opts.repo) {
            throw new TypeError('no repository provided');
         }

         if (!opts.channel) {
            throw new TypeError('no channel provided');
         }

         this.mergeOptions(opts, ['formRegion', 'resultsRegion', 'repo', 'channel']);
      },

      createSearchFormView: function () {
         var view = new SearchFormView();

         view.on('search', function (query, searchOptions) {
            this.channel.trigger('search', query, searchOptions);
         }, this);

         return view;
      },

      ensureSearchFormView: function () {
         if (!this.searchFormView) {
            this.searchFormView = this.createSearchFormView();

            this.searchFormView.on('destroy', function () {
               this.searchFormView = null;
            }, this);

            this.formRegion.show(this.searchFormView);
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

                  this.resultsRegion.show(resultsView);
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
            formRegion: opts.formRegion,
            resultsRegion: opts.resultsRegion,
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
