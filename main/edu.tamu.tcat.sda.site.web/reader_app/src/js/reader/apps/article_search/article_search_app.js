define(function (require) {

   var Marionette = require('marionette');
   var _ = require('underscore');
   var Widgets = require('trc-ui-widgets');


   var ArticleSearchController = Marionette.Controller.extend({

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
            placeholder: 'Search Articles',
            searchProvider: function (q, limit) {
               return _this.repo.search(q, { limit: limit }).then(function (results) {
                  return results.articles.map(function (article) {
                     return {
                        title: article.get('title'),
                        obj: article
                     };
                  });
               });
            }
         });

         this.region.show(this.searchForm.getView());

         this.listenTo(this.searchForm, 'result:click', function(article)
         {
            this.channel.trigger('article:show', article.id);
         });
      },

      listArticles: function () {
         if (this.region.currentView !== this.searchForm.getView()) {
            this.region.show(this.searchForm.getView());
         }

         this.searchForm.search('');
      }
   });


   var ArticleSearchRouter = Marionette.AppRouter.extend({
      appRoutes: {
         'article': 'listArticles'
      }
   });


   return {
      initialize: function (options) {
         var opts = _.defaults(_.clone(options) || {}, {});

         var controller = new ArticleSearchController({
            region: opts.region,
            repo: opts.repo,
            channel: opts.channel
         });

         var router = new ArticleSearchRouter({
            controller: controller
         });

         opts.channel.on('article:list', function () {
            router.navigate('article');
            controller.listArticles();
         });

         return router;
      }
   };

});
